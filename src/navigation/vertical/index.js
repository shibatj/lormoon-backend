const getUserRole = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).Role : null;
}

const navigation = () => {
  const userRole = getUserRole();

  let navItems = [];



  if (userRole === 'User') {
    navItems.push(
      {
        title: 'เมนูหลัก',
        icon: 'tabler:smart-home',
        children: [
          {
            title: 'แดชบอร์ด',
            path: '/user_dashboard'
          }
        ]
      }
    )
  }

  if (userRole === 'Admin') {

    navItems.push(
      {
        title: 'เมนูหลัก',
        icon: 'tabler:smart-home',
        children: [
          {
            icon: 'icon-park:pie-five',
            title: 'แดชบอร์ด',
            path: '/dashboard'
          }
        ]
      },
      {
        title: 'ข้อมูลระบบ',
        icon: 'carbon:data-blob',
        children: [
          {
            icon: 'solar:card-2-broken',
            title: 'สร้างคูปอง',
            path: '/generate_coupon'
          },
          {
            icon: 'game-icons:profit',
            title: 'รายรับ',
            path: '/manage_debit'
          },
          {
            icon: 'game-icons:expense',
            title: 'รายจ่าย',
            path: '/manage_credit'
          },
        ]
      },
      {
        title: 'ผู้ดูแลระบบ',
        icon: 'tabler:smart-home',
        children: [
          {
            title: 'ข้อมูลผู้ใช้งาน',
            icon: 'tabler:user',
            path: '/projects/userlist'
          }
        ]
      }
    )


  }

  return navItems;
}

export default navigation;
