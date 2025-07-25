from django.urls import path
from .views import (
    ProductListCreateView, ProductDeleteView, ProductUpdateView,
    OrderCreateView, OrderListView, OrderDeleteView, OrderUpdateView,
    UserCreateView, OrderItemUpdateView
)

urlpatterns = [
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('products/<int:pk>/update/', ProductUpdateView.as_view(), name='product-update'),

    path('user/register/', UserCreateView.as_view(), name='user-register'),

    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/<int:pk>/delete/', OrderDeleteView.as_view(), name='order-delete'),
    path('orders/<int:pk>/update/', OrderUpdateView.as_view(), name='order-update'),
    path("orders/<int:order_id>/update-item/", OrderItemUpdateView.as_view(), name="update-order-item"),

]
