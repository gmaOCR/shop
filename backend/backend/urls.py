from django.contrib import admin
from django.apps import apps
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from schema_graph.views import Schema
from rest_framework import routers

router = routers.DefaultRouter()

urlpatterns = [
    path("api/", include("oscarapi.urls")),  # oscarpi
    path('', include(apps.get_app_config('oscar').urls[0])),  # for dashboard
    path("api/", include("api.urls")),  # local app API
    path("api/", include("payment_stripe.urls"))
]

if settings.DEBUG:
    urlpatterns.append(path('admin/', admin.site.urls))
    urlpatterns.append(path("schema/", Schema.as_view()))
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
