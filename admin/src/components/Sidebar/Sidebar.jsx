import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets.js';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? 'active' : ''}`
          }
          end
        >
          <img src={assets.home_icon} alt="Dashboard" />
          <p>Dashboard</p>
        </NavLink>

        <NavLink
          to="/admin/products/add"
          className={() =>
            `sidebar-option ${pathname === '/admin/products/add' ? 'active' : ''}`
          }
          end
        >
          <img src={assets.add_icon} alt="Add Product" />
          <p>Add Product</p>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={() =>
            `sidebar-option ${pathname === '/admin/products' ? 'active' : ''}`
          }
          end
        >
          <img src={assets.order_icon} alt="List Products" />
          <p>List Products</p>
        </NavLink>

        <NavLink
          to="/admin/products/edit"
          className={() =>
            `sidebar-option ${pathname === '/admin/products/edit' ? 'active' : ''}`
          }
          end
        >
          <img src={assets.pencil_icon} alt="Edit Product" />
          <p>Edit Product</p>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? 'active' : ''}`
          }
          end
        >
          <img src={assets.request_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
        <NavLink
          to="/admin/gardeners"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? 'active' : ''}`
          }
          end
        >
          <img src={assets.gardener_icon || assets.order_icon} alt="List Gardeners" />
          <p>List Gardeners</p>
        </NavLink>
        <NavLink
          to="/admin/gardeners/add"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? 'active' : ''}`
          }
          end
        >
          <img src={assets.add_icon} alt="Add Gardener" />
          <p>Add Gardener</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
