import { NextApiRequest, NextApiResponse } from "next"

// Fectch repo data from github
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(
    `https://api.github.com/repos/${req.query.owner}/${req.query.repo}/contents`
  )
  const data = await response.json()

  res.status(200).json(data)
}
