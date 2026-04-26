const mongoose = require("mongoose");

const postSearchIndex = {
  name: "post_search_index",
  definition: {
    mappings: {
      dynamic: false,
      fields: {
        content: { type: "text" },
      },
    },
  },
};

async function createSearchIndexes() {
  try {
    const collection = mongoose.connection.collection("posts");

    const existing = await collection.listSearchIndexes().toArray();
    const alreadyExists = existing.some((i) => i.name === postSearchIndex.name);

    if (alreadyExists) {
      return;
    }

    await collection.createSearchIndex(postSearchIndex);
  } catch (err) {
    console.error(" Failed to create search index:", err);
  }
}

module.exports = createSearchIndexes;
