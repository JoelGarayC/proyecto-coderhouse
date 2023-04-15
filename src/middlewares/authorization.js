export const authorization = (role) => {
  return (req, res, next) => {
    console.log(req.user)
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
    if (req.user.role !== role)
      return res.status(403).json({ error: 'no role specified' })
    next()
  }
}
