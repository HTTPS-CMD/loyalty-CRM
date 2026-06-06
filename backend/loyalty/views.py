# مسیر: backend/loyalty/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db import transaction
from .models import Customer, Wallet, Transaction
from .serializers import CustomerSerializer, TransactionSerializer
from django.db.models import Sum
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

# API اول: دریافت اطلاعات یک مشتری بر اساس شماره موبایل
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customer_profile(request, phone_number):
    customer = get_object_or_404(Customer, phone_number=phone_number)
    serializer = CustomerSerializer(customer)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_customer(request):
    data = request.data
    name = data.get('name')
    phone = data.get('phone')
    mbti = data.get('mbti')
    referrer_phone = data.get('referrer_phone') # دریافت کد معرف
    
    if not name or not phone:
        return Response({"error": "نام و شماره موبایل الزامی است."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            user, created = User.objects.get_or_create(username=phone, defaults={'first_name': name})
            
            if not created:
                return Response({"error": "این شماره موبایل قبلاً ثبت شده است."}, status=status.HTTP_400_BAD_REQUEST)

            # بررسی اینکه آیا معرف در سیستم وجود دارد یا خیر
            parent_customer = None
            if referrer_phone:
                parent_customer = Customer.objects.filter(phone_number=referrer_phone).first()

            customer = Customer.objects.create(
                user=user,
                phone_number=phone,
                level='برنزی',
                parent=parent_customer  # اتصال مشتری به معرف
            )
            
            Wallet.objects.create(customer=customer, balance=0)

        return Response({"message": f"مشتری {name} با موفقیت ثبت شد."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_customers(request):
    # دریافت تمام مشتریان و مرتب‌سازی از جدیدترین به قدیمی‌ترین
    customers = Customer.objects.all().order_by('-created_at')
    # many=True به DRF می‌گوید که داریم یک لیست را تبدیل می‌کنیم نه یک آبجکت
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def charge_wallet(request):
    data = request.data
    customer_id = data.get('customer_id')
    amount = int(data.get('amount', 0))
    action_type = data.get('action_type', 'manual')
    note = data.get('note', 'بدون توضیح')

    if not customer_id or amount <= 0:
        return Response({"error": "انتخاب مشتری و وارد کردن مبلغ (بیشتر از صفر) الزامی است."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            wallet = Wallet.objects.get(customer__id=customer_id)
            wallet.balance += amount
            wallet.save()

            # --- بخش جدید: ارتقاء خودکار سطح مشتری ---
            customer = wallet.customer
            if wallet.balance >= 5000000:
                customer.level = 'الماس'
            elif wallet.balance >= 2000000:
                customer.level = 'طلایی'
            elif wallet.balance >= 500000:
                customer.level = 'نقره‌ای'
            else:
                customer.level = 'برنزی'
            customer.save()
            # ----------------------------------------

            Transaction.objects.create(
                wallet=wallet,
                amount=amount,
                transaction_type='deposit',
                description=f"اقدام: {action_type} | {note}"
            )

        return Response({
            "message": f"مبلغ {amount} تومان با موفقیت واریز شد.",
            "new_balance": wallet.balance
        }, status=status.HTTP_200_OK)

    except Wallet.DoesNotExist:
        return Response({"error": "کیف پول یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_transactions(request):
    # دریافت تمام تراکنش‌ها و مرتب‌سازی از جدیدترین به قدیمی‌ترین
    transactions = Transaction.objects.all().order_by('-created_at')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    # آمارهای کلی
    total_customers = Customer.objects.count()
    total_balance = Wallet.objects.aggregate(Sum('balance'))['balance__sum'] or 0
    total_transactions = Transaction.objects.count()
    network_size = Customer.objects.filter(parent__isnull=False).count()

    # --- بخش اصلاح شده: توزیع سطوح (محاسبه زنده بر اساس موجودی) ---
    levels = {
        # برنزی: زیر ۵۰۰ هزار تومان
        'bronze': Customer.objects.filter(wallet__balance__lt=500000).count(),
        # نقره‌ای: بین ۵۰۰ هزار تا زیر ۲ میلیون تومان
        'silver': Customer.objects.filter(wallet__balance__gte=500000, wallet__balance__lt=2000000).count(),
        # طلایی: بین ۲ میلیون تا زیر ۵ میلیون تومان
        'gold': Customer.objects.filter(wallet__balance__gte=2000000, wallet__balance__lt=5000000).count(),
        # الماس: ۵ میلیون تومان و بیشتر
        'diamond': Customer.objects.filter(wallet__balance__gte=5000000).count(),
    }
    # -------------------------------------------------------------

    # ۵ مشتری برتر بر اساس موجودی کیف پول
    top_customers = Customer.objects.order_by('-wallet__balance')[:5]
    top_customers_data = CustomerSerializer(top_customers, many=True).data

    # ۵ تراکنش آخر
    recent_transactions = Transaction.objects.order_by('-created_at')[:5]
    recent_transactions_data = TransactionSerializer(recent_transactions, many=True).data

    return Response({
        "total_customers": total_customers,
        "total_balance": total_balance,
        "total_transactions": total_transactions,
        "network_size": network_size,
        "levels": levels,
        "top_customers": top_customers_data,
        "recent_transactions": recent_transactions_data,
    }, status=status.HTTP_200_OK)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_network_data(request):
    customers = Customer.objects.select_related('user', 'parent', 'wallet').all()
    data = []
    for c in customers:
        wallet = getattr(c, 'wallet', None)
        data.append({
            "id": c.id,
            "name": c.user.first_name,
            "phone": c.phone_number,
            "parent_id": c.parent.id if c.parent else None,
            "balance": wallet.balance if wallet else 0,
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wallets_data(request):
    customers = Customer.objects.select_related('user', 'wallet').all()
    data = []
    
    for c in customers:
        wallet = getattr(c, 'wallet', None)
        balance = wallet.balance if wallet else 0
        
        # محاسبه کل درآمد (فقط واریزی‌ها)
        total_earned = 0
        tx_count = 0
        if wallet:
            tx_count = Transaction.objects.filter(wallet=wallet).count()
            earned_dict = Transaction.objects.filter(wallet=wallet, transaction_type='deposit').aggregate(Sum('amount'))
            total_earned = earned_dict['amount__sum'] or 0
            
        # محاسبه سرانگشتی زیرمجموعه‌های مستقیم
        network_size = Customer.objects.filter(parent=c).count()
        
        data.append({
            "id": c.id,
            "name": c.user.first_name,
            "phone": c.phone_number,
            "level": c.level,
            "balance": balance,
            "tx_count": tx_count,
            "total_earned": total_earned,
            "network_size": network_size,
        })
    
    # مرتب‌سازی کاربران بر اساس بیشترین موجودی کیف پول
    data = sorted(data, key=lambda x: x['balance'], reverse=True)
    return Response(data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_customer(request, customer_id):
    try:
        customer = Customer.objects.get(id=customer_id)
        user = customer.user
        customer.delete()  # این کار کیف پول را هم خودکار پاک می‌کند
        user.delete()      # پاک کردن یوزر اصلی
        return Response({"message": "مشتری با موفقیت حذف شد."}, status=status.HTTP_200_OK)
    except Customer.DoesNotExist:
        return Response({"error": "مشتری پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_customer(request, customer_id):
    try:
        customer = Customer.objects.get(id=customer_id)
        user = customer.user
        
        data = request.data
        new_name = data.get('name')
        new_phone = data.get('phone')
        
        # آپدیت نام (که در جدول User جنگو ذخیره می‌شود)
        if new_name:
            user.first_name = new_name
            user.save()
            
        # آپدیت شماره موبایل (که در جدول Customer ما ذخیره می‌شود)
        if new_phone:
            # بررسی اینکه شماره موبایل جدید تکراری نباشد (متعلق به شخص دیگری نباشد)
            if Customer.objects.filter(phone_number=new_phone).exclude(id=customer_id).exists():
                return Response({"error": "این شماره موبایل توسط مشتری دیگری استفاده شده است."}, status=status.HTTP_400_BAD_REQUEST)
                
            customer.phone_number = new_phone
            customer.save()
            
        return Response({"message": "اطلاعات مشتری با موفقیت به‌روزرسانی شد."}, status=status.HTTP_200_OK)
        
    except Customer.DoesNotExist:
        return Response({"error": "مشتری پیدا نشد."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# این تنها تابعی است که نباید قفل IsAuthenticated داشته باشد تا کاربر بتواند وارد شود
@api_view(['POST'])
def login_admin(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # بررسی صحت نام کاربری و رمز عبور در جنگو
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # ساخت یا دریافت توکن امنیتی برای این کاربر
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key, 
            "message": "ورود با موفقیت انجام شد."
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "error": "نام کاربری یا رمز عبور اشتباه است."
        }, status=status.HTTP_401_UNAUTHORIZED)