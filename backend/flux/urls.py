from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
import os

DIST_DIR = os.path.join(settings.BASE_DIR, 'dist')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/finance/', include('finance.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(DIST_DIR, 'assets')}),
    re_path(r'^fonts/(?P<path>.*)$', serve, {'document_root': os.path.join(DIST_DIR, 'fonts')}),
    re_path(r'^icons/(?P<path>.*)$', serve, {'document_root': os.path.join(DIST_DIR, 'icons')}),
    re_path(r'^(?P<path>.*\.(json|png|ico|svg|webmanifest|txt))$', serve, {'document_root': DIST_DIR}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]