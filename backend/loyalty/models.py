from django.db import models
from django.contrib.auth.models import User

# ۱. مدل مشتریان (شامل ساختار درختی و شبکه‌ای)
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    phone_number = models.CharField(max_length=15, unique=True, verbose_name="شماره تماس")
    
    # سطح کاربری (مثلاً برنزی، نقره‌ای، طلایی)
    level = models.CharField(max_length=50, default='برنزی', verbose_name="سطح کاربری")
    
    # کلید اصلی برای سیستم شبکه ۳ سطحی (هر مشتری می‌تواند زیرمجموعه یک مشتری دیگر باشد)
    parent = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='subsets',
        verbose_name="معرف"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ عضویت")

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.phone_number}"

# ۲. مدل کیف پول
class Wallet(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name='wallet')
    # استفاده از IntegerField برای مبالغ تومانی (بدون اعشار)
    balance = models.IntegerField(default=0, verbose_name="موجودی (تومان)")
    
    def __str__(self):
        return f"کیف پول {self.customer.user.username} - موجودی: {self.balance}"

# ۳. مدل تاریخچه تراکنش‌ها (برای لاگ کردن تمام ورودی‌ها و خروجی‌ها)
class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('deposit', 'واریز'),
        ('withdraw', 'برداشت'),
    )
    
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    amount = models.IntegerField(verbose_name="مبلغ تراکنش")
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, verbose_name="نوع تراکنش")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات (مثل: پاداش زیرمجموعه سطح ۱)")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ تراکنش")

    def __str__(self):
        return f"{self.get_transaction_type_display()} {self.amount} - {self.wallet.customer.user.username}"