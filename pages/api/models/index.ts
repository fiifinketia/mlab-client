import { NextApiRequest, NextApiResponse } from "next"

// Fectch repo data from github
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/models/`
	);
  const data = await response.json()

  res.status(200).json(data)
}
