// src/components/Navbar.js

export function Navbar() {
  return `
    <nav class="navbar">
      <div class="nav-container">
        
        <!-- Logo bên trái -->
        <a href="#" class="nav-logo">
          <span class="logo-icon">✦</span>
          <span class="logo-text">Tinh Hà 776C77</span>
        </a>

        <!-- Cụm 3 nút căn chính giữa tuyệt đối -->
        <div class="nav-center">
          <a href="#nhan-vat" class="nav-item">Nhân vật</a>
          <a href="#tim-kiem" class="nav-item">Tìm kiếm</a>
          <a href="#thu-vien" class="nav-item">Thư viện</a>
        </div>

        <!-- Nút Chuyển Dark Mode bên phải -->
        <div class="nav-actions">
          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">
            <span class="theme-icon">🌙</span>
          </button>
        </div>

      </div>
    </nav>
  `;
}