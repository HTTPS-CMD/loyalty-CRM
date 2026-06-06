from django.urls import path
from . import views

urlpatterns = [
    path('profile/<str:phone_number>/', views.get_customer_profile, name='customer-profile'),
    # این خط اضافه شود:
    path('customers/create/', views.create_customer, name='create-customer'),
    path('customers/', views.get_all_customers, name='all-customers'),
    path('wallet/charge/', views.charge_wallet, name='charge-wallet'),
    path('transactions/', views.get_all_transactions, name='all-transactions'),
    path('dashboard/', views.get_dashboard_stats, name='dashboard-stats'),
    path('network/', views.get_network_data, name='network-data'),
    path('wallets/', views.get_wallets_data, name='wallets-data'),
    path('customers/<int:customer_id>/delete/', views.delete_customer, name='delete-customer'),
    path('customers/<int:customer_id>/update/', views.update_customer, name='update-customer'),
    path('auth/login/', views.login_admin, name='login-admin'),
]