import b from "benny";
import { produce as structura } from "../index";
import { produce as immer, setAutoFreeze } from "immer";
import { Map as immutable } from "immutable";

setAutoFreeze(false);

function getMyObj() {
  const myObj: any = {};
  let curr = myObj;
  for (let i = 0; i != 10000; i++) {
    curr = curr.prop = { test: 1 };
  }
  return myObj;
}

b.suite(
  "Produce nested object with many modifications",

  b.add("with structura", () => {
    structura(getMyObj(), (draft) => {
      let curr = draft.prop;
      for (let i = 0; i != 35; i++) {
        curr = curr.prop;
        curr.test = 2;
      }
    });
  }),

  b.add("with immer", () => {
    immer(getMyObj(), (draft: any) => {
      let curr = draft.prop;
      for (let i = 0; i != 35; i++) {
        curr = curr.prop;
        curr.test = 2;
      }
    });
  }),

  b.add("with immutable", () => {
    const map = immutable(getMyObj());
    let curr = [];
    for (let i = 0; i != 35; i++) {
      curr.push("prop");
      map.setIn(curr, 2);
    }
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: "nested_many", version: "1.0.0" }),
  b.save({ file: "nested_many", format: "chart.html" })
);
