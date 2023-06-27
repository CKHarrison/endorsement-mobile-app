import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://we-are-the-champions-d5319-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsListDB = ref(database, "endorsements");

const inputEl = document.getElementById("input");
const fromEl = document.getElementById("input-from");
const toEl = document.getElementById("input-to");
const publishBtn = document.getElementById("publish-btn");
const endorsementListEl = document.getElementById("endorsement-list");

publishBtn.addEventListener("click", function () {
  let input = inputEl.value;
  let fromVal = fromEl.value;
  let toVal = toEl.value;

  let totalInput = [input, fromVal, toVal, 0];

  if (!input || !fromVal || !toVal) {
    push(endorsementsListDB, totalInput);
  }

  clearInput();
});

function clearInput() {
  inputEl.value = "";
  fromEl.value = "";
  toEl.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = "";
}

// grab all the items from the db
onValue(endorsementsListDB, function (snapshot) {
  if (snapshot.exists()) {
    let items = Object.entries(snapshot.val());
    clearEndorsementListEl();
    for (let i = items.length - 1; i >= 0; i--) {
      let currentItem = items[i];

      appendItemToEndorsementList(currentItem);
    }
  } else {
    endorsementListEl.innerHTML = "No endorsements yet... Endorse someone!";
  }
});

function appendItemToEndorsementList(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let rating = Number(item[2]);
  let [input, recipient, sender] = itemValue;

  let newItem = document.createElement("li");
  newItem.className = "endorsement-text";

  newItem.innerHTML = generateEndorsementText(sender, input, recipient);

  // Remove item from list
  newItem.addEventListener("dblclick", function () {
    let location = itemLocation(itemID);
    remove(location);
  });
  endorsementListEl.appendChild(newItem);
}

function generateEndorsementText(sender, input, recipient) {
  return `
  <div class=endorsement-container>
    <p class="sender">
        From ${sender}
    </p>
    <p class="endorsement-body">
        ${input}
    </p>
   <div class="row">
    <p class="recipient">
        To ${recipient}
    </p>
    <!--  <div class="rating-info">
        <button class="rating-btn" id="rating-btn">❤️</button>
        <p class="rating--number"></p>
    </div> -->
   </div>
  </div>
  `;
}
// TODO: add rating functionality
function increaseRating() {
  const ratingBtn = document.getElementById("rating-btn");
  let isRated = false;
  ratingBtn.addEventListener("click", function () {
    if (!isRated) {
      console.log("this is the rating " + rating);
      rating++;
      let location = itemLocation(itemID);
      let updatedEndorsement = {
        0: input,
        1: sender,
        2: recipient,
        3: rating,
      };
      //   update(location, updatedEndorsement);
      console.log(updatedEndorsement);
      alert("check if rating is updated! should be " + rating);
      isRated = true;
    }
  });
}

function itemLocation(itemID) {
  let location = ref(database, `endorsements/${itemID}`);
  return location;
}
