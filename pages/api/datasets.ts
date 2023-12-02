import { NextApiRequest, NextApiResponse } from "next"

// Fectch repo data from github
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Resend POST req multipart/form-data to FastAPi at 0.0.0.0:8000/api/datasets
    // Send encoded data to FastAPI request.form()
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + '/api/datasets',
      {
        method: 'POST',
        body: req.body
      }
    )

    console.log(response.json().then(data => console.log(data)))

    

    
  } catch (error) {
    console.log("🚀 ~ file: datasets.ts:22 ~ error:", error)
  } finally {
     // Redirect to /app/datasets
    res.redirect('/app/datasets') 
  }
}
