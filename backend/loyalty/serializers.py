from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Wallet, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['balance']

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    wallet = WalletSerializer(read_only=True)
    
    class Meta:
        model = Customer
        fields = ['id', 'user', 'phone_number', 'level', 'parent', 'wallet']
        

class TransactionSerializer(serializers.ModelSerializer):
    # برای اینکه اسم مشتری را هم در تراکنش داشته باشیم
    customer_name = serializers.CharField(source='wallet.customer.user.first_name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'customer_name', 'amount', 'transaction_type', 'description', 'created_at']