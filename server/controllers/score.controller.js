import Score from '../models/score.model.js';


export const createScore = async (req, res) => {
    try {
        const { playerName, score, level, defeatedBoss, userId } = req.body;

        if (!playerName || !score || !level) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const scoreData = {
            playerName,
            score,
            level,
            defeatedBoss
        };

        if (req.user && req.user.uid) {
            scoreData.userId = req.user.uid;
        }

        else if (userId) {
            scoreData.userId = userId;
        }

        if (scoreData.userId) {
            console.log(`Checking existing scores for user ${scoreData.userId} before saving`);

            const existingScores = await Score.find({ userId: scoreData.userId }).sort({ score: -1 });

            if (existingScores.length > 0) {
                const bestScore = existingScores[0].score;
                console.log(`User's best score: ${bestScore}, new score: ${score}`);


                if (score <= bestScore) {
                    console.log(`Skipping save - new score (${score}) is not higher than best score (${bestScore})`);
                    return res.status(200).json({
                        message: 'Existing result is higher',
                        existingScore: existingScores[0]
                    });
                }

                console.log(`Deleting ${existingScores.length} old scores before saving new one`);
                const deleteResult = await Score.deleteMany({ userId: scoreData.userId });
                console.log(`Delete result: deleted ${deleteResult.deletedCount} documents`);


                if (deleteResult.acknowledged !== true) {
                    console.warn("Delete operation was not acknowledged properly");
                }

                await new Promise(resolve => setTimeout(resolve, 300));


                const remainingDocs = await Score.countDocuments({ userId: scoreData.userId });
                if (remainingDocs > 0) {
                    console.warn(`Warning: ${remainingDocs} documents still exist after deletion`);

                    await Score.deleteMany({ userId: scoreData.userId });
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
        }

        const newScore = await Score.create(scoreData);
        console.log(`New score saved: ${newScore._id}`);

        if (scoreData.userId) {
            const allUserScores = await Score.find({ userId: scoreData.userId }).sort({ createdAt: -1 });
            if (allUserScores.length > 1) {
                console.log(`Found ${allUserScores.length} scores for user after save, cleaning up duplicates`);

                const latestScore = allUserScores[0];
                const scoresToDelete = allUserScores
                    .slice(1)
                    .map(s => s._id);

                if (scoresToDelete.length > 0) {
                    console.log(`Deleting ${scoresToDelete.length} duplicate scores`);
                    await Score.deleteMany({ _id: { $in: scoresToDelete } });
                }
                return res.status(201).json(latestScore);
            }
        }

        res.status(201).json(newScore);
    } catch (error) {
        console.error('Error creating score:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getScores = async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 });
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error retrieving scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTopScores = async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10);
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error retrieving top scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserScores = async (req, res) => {
    try {
        let userId = req.params.userId;

        if (!userId && req.user && req.user.uid) {
            userId = req.user.uid;
        }
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (req.user && req.user.uid !== userId) {

            console.warn(`User ${req.user.uid} is attempting to access scores for user ${userId}`);
        }

        const scores = await Score.find({ userId }).sort({ score: -1 });
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error retrieving user scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUserScores = async (req, res) => {
    try {
        let userId = req.params.userId;


        if (!userId && req.user && req.user.uid) {
            userId = req.user.uid;
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }


        if (req.user && req.user.uid !== userId) {
            console.warn(`User ${req.user.uid} is trying to delete scores of user ${userId}`);
            // return res.status(403).json({ message: 'Unauthorized to delete these scores' });
        }
        const result = await Score.deleteMany({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No scores found for this user' });
        }

        res.status(200).json({
            message: `Successfully deleted ${result.deletedCount} scores for user ${userId}`
        });
    } catch (error) {
        console.error('Error deleting user scores:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 