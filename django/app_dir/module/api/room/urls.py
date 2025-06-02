from django.urls import path
from .views import (
    RoomListAPIView, RoomCreateAPIView, RoomDetailAPIView,
    RoomUpdateAPIView, RoomDeleteAPIView
)

urlpatterns = [
    path('', RoomListAPIView.as_view(), name='room-list'),
    path('create/', RoomCreateAPIView.as_view(), name='room-create'),
    path('<int:pk>/', RoomDetailAPIView.as_view(), name='room-detail'),
    path('<int:pk>/update/', RoomUpdateAPIView.as_view(), name='room-update'),
    path('<int:pk>/delete/', RoomDeleteAPIView.as_view(), name='room-delete'),
]