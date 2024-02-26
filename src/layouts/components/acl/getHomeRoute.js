/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'client') return '/acl'
  else if (role==='Admin') return '/dashboard'
  else if (role==='User') return '/user_dashboard'
  else if (role==='ProvinceAdmin') return '/admin_pinlist'
  else return '/reports/percent_grade'
}

export default getHomeRoute
