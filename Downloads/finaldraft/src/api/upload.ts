// pages/api/saveUser.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource, initializeDataSource } from 'src/ormconfig';
import { User } from 'src/entity/User';

export const config = {
  api: {
    bodyParser: true, // Automatically parse the incoming request body
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Log the received data for debugging
      console.log('Received data:', req.body);

      // Initialize the data source (DB connection)
      await initializeDataSource();
      console.log('AppDataSource initialized successfully.');

      const userRepository = AppDataSource.getRepository(User);

      const users: {
        id: number;
        task: string;
    }[] = req.body;

      // Extract the users array from the request body

      // Validate the data (check if id and task exist for each user)
      users.forEach((user, index) => {
        if (!user.id || !user.task) {
          throw new Error(`Invalid user data at index ${index}. Both 'id' and 'task' are required.`);
        }
      });

      // Save the users to the database
      const savedUsers = await userRepository.save(users);
      console.log(`Successfully saved ${savedUsers.length} users`);

      // Return success response
      return res.status(200).json({
        message: `Successfully saved ${savedUsers.length} users`,
      });

    } catch (error) {
      console.error('Error in API route:', error);
      // Return error response in JSON format
      return res.status(500).json({
        error: 'Failed to save data',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  } else {
    // Handle invalid HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
