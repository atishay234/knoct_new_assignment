const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs-mate");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view-engine", ejs);

class financier {
  constructor(name, history) {
    this.name = name;
    this.history = history;
    let sum = 0;
    for (let i = 0; i < history.length; i++) {
      sum += history[i][1];
    }
    this.average = sum / history.length;
  }
}
class customer {
  constructor(name, cibil) {
    this.name = name;
    this.cibil = cibil;
  }
}

let financiers = [];
let data_fin = [
  {
    name: "fin_1",
    history: [
      [100, 700],
      [50, 650],
      [75, 600],
    ],
  },
  {
    name: "fin_2",
    history: [
      [100, 750],
      [50, 700],
      [75, 650],
    ],
  },
  {
    name: "fin_3",
    history: [
      [100, 800],
      [50, 750],
      [75, 700],
    ],
  },
  {
    name: "fin_4",
    history: [
      [50, 610],
      [75, 700],
    ],
  },
  {
    name: "fin_5",
    history: [
      [200, 850],
      [250, 875],
      [300, 900],
      [225, 875],
    ],
  },
  {
    name: "fin_6",
    history: [
      [40, 500],
      [75, 600],
      [100, 650],
      [200, 800],
      [250, 850],
    ],
  },
];

function randomize_data(data_fin) {
  for (let i = 0; i < data_fin.length; i++) {
    for (let j = 0; j < data_fin[i].history.length; j++) {
      let rand_no = Math.floor(Math.random() * 900) + 300;
      data_fin[i].history[j][1] = rand_no;
      console.log(rand_no);
    }
  }
}

randomize_data(data_fin);

function make_financier(data_fin) {
  for (let i = 0; i < data_fin.length; i++) {
    let fin = new financier(data_fin[i].name, data_fin[i].history);
    financiers.push(fin);
  }
}
make_financier(data_fin);

function sort_financiers(financiers, customer) {
  let differences = [];
  for (let i = 0; i < financiers.length; i++) {
    differences.push({
      name: financiers[i].name,
      diff: Math.abs(financiers[i].average - customer.cibil),
      size: financiers[i].history.length,
    });
  }
  differences.sort((a, b) => {
    if (a.diff == b.diff) return b.size - a.size;
    else return b.diff - a.diff;
  });
  return differences;
}

app.get("/", (req, res) => {
  res.render(path.join(__dirname, "/index.ejs"));
});

app.post("/sort", (req, res) => {
  let { name, cibil_score } = req.body;
  console.log(cibil_score);
  let new_customer = new customer(name, cibil_score);
  let matched_fin = sort_financiers(financiers, new_customer);
  console.log(matched_fin[0].name);
  res.render(path.join(__dirname, "/result.ejs"), { financier: matched_fin });
});

app.listen(3000, () => {
  console.log("server started on port 3000");
});
