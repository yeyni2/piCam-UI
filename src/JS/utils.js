import {
    ref,
    push,
    update,
    get,
    set,
    query,
    orderByChild,
    startAt,
    limitToFirst,
    increment,
  } from "firebase/database";
  import { database, ui, uiConfig } from "./firebaseConfig.js";
  
  const pushToFirabase = (ref, newData) => {
    const dataRef = ref(database, ref);
    push(dataRef, newData);
    // Can add validation of the action here
  };
  
  const updateFirebase = (ref, updatedData) => {
    const dataRef = ref(database, ref);
    update(dataRef, updatedData);
    // Check if action was successful
  };
  
  const getArticlesCount = async () => {
    const dataRef = ref(database, "articles/count/value");
    let snapshot = await get(dataRef);
    if (snapshot.exists()) return snapshot.val();
    console.error("count was not found");
    return 0;
  };
  
  const incrementCounter = (amount) => {
    const countRef = ref(database, "articles/count/value");
    set(countRef, increment(amount));
  };
  
  // const decrementCounter = (amount) => {
  //   if (parseInt(getArticlesCount) < amount) {
  //     console.error(
  //       "Error: tried to remove more articles then exists in the count"
  //     );
  //   }
  //   const countRef = ref(database, "articles/count/value");
  //   set(countRef, decrement(amount));
  // };
  
  const addArticles = (ref, newData) => {
    let filterdData = {};
    newData.forEach((title, value) => {
      let snapShot = get(ref(database, `articles/${title}`));
      if (!snapShot.exists() && value["index"].exists()) {
        filterdData[title] = value;
      }
    });
    pushToFirabase(ref, filterdData);
    incrementCounter(Object.keys(filterdData).length);
  };
  
  const getRandomArticle = async () => {
    let count = await getArticlesCount();
    let articleIndex = Math.floor(Math.random() * parseInt(count));
    const dataRef = ref(database, "articles/");
  
    try {
      const snapshot = await get(
        query(
          dataRef,
          orderByChild("index"),
          startAt(articleIndex),
          limitToFirst(1)
        )
      );
      if (snapshot.exists()) {
        return snapshot.val();
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const addVote = (title, voteType) => {
    if (voteType != "correct" && voteType != "incorrect")
      console.error("invalid vote");
    let dbRef = "articles/" + title + "/votes/" + voteType;
    const dataRef = ref(database, dbRef);
    set(dataRef, increment(1));
  };
  
  const startFirebaseUI = (id) => {
    ui.start(id, uiConfig);
  };
  
  export {
    getRandomArticle,
    addArticles,
    updateFirebase,
    pushToFirabase,
    addVote,
    startFirebaseUI
  };
  