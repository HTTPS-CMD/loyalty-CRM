from django.contrib import admin
from .models import Customer, Wallet, Transaction

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'level', 'parent', 'created_at')
    search_fields = ('phone_number', 'user__username')
    list_filter = ('level',)

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('customer', 'balance')
    search_fields = ('customer__phone_number',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('wallet', 'transaction_type', 'amount', 'created_at')
    list_filter = ('transaction_type',)