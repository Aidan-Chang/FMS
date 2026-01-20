export const elmah = `
html,
body {
  height: 100%;
  background: #fff;
}
#app, .e-view {
  height: 100%;
}
.navbar-brand {
  display: none;
}
.navbar-dark .navbar-nav .nav-item:nth-child(n+5):nth-child(-n+6) {
  display: none;
}
.bg-dark {
  background-color: #f8f8f8 !important;
  border-color: #e7e7e7;
}
.navbar {
  padding: 2px;
  border-bottom: 1px solid #e7e7e7;
}
.navbar-dark .navbar-nav .nav-link {
  color: #78716c;
}
.navbar-dark .navbar-nav .active>.nav-link,
.navbar-dark .navbar-nav .nav-link.active,
.navbar-dark .navbar-nav .nav-link.show,
.navbar-dark .navbar-nav .show>.nav-link {
  color: #134e4a;
}
.navbar-dark .navbar-nav .nav-link:focus, .navbar-dark .navbar-nav .nav-link:hover {
  color: #0f766e;
}
.e-list {
  width: 20% !important;
  min-width: 250px !important;
  max-width: 350px !important;
  .e-list-content {
    height: calc(100vh - 92px) !important;
    overflow-y: auto !important;
  }
  .total-count {
    text-align: center !important;
    padding: .75rem;
    border-top: 1px solid #e7e7e7;
    height: 2rem;
  }
}
body.dark-mode {
  background: #22272e;
  .bg-dark {
    background-color: #2d333b !important;
  }
  .navbar {
    border-bottom: 1px solid #4d4d4d;
  }
  .navbar-dark .navbar-nav .nav-link {
    color: #78716c;
  }
  .navbar-dark .navbar-nav .active>.nav-link,
  .navbar-dark .navbar-nav .nav-link.active,
  .navbar-dark .navbar-nav .nav-link.show,
  .navbar-dark .navbar-nav .show>.nav-link {
    color: #14b8a6;
  }
  .navbar-dark .navbar-nav .nav-link:focus, .navbar-dark .navbar-nav .nav-link:hover {
    color: #99f6e4;
  }
  .e-list .e-list-content::-webkit-scrollbar-track {
    scrollbar-color: #78716c;
  }
  .e-list {
    border-right: 1px solid #4d4d4d;
    .total-count {
      border-top: 1px solid #4d4d4d;
      color: #e7e7e7;
    }
  }
}
`