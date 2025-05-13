const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/floune';

const runMigration = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const usersCollection = mongoose.connection.collection('users');

    await usersCollection.updateMany(
      {},
      {
        $rename: {
          likedAlbums: 'likedPlaylists',
          uploadedAlbums: 'uploadedPlaylists',
        },
      }
    );

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

runMigration();