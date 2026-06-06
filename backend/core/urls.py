from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # متصل کردن آدرس‌های اپلیکیشن loyalty به هسته اصلی
    path('api/loyalty/', include('loyalty.urls')),
]