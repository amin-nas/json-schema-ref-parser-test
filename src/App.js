import $RefParser from "@apidevtools/json-schema-ref-parser";
import './App.css';

const mySchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Ensemble",
  "type": "object",
  "properties": {
    "View": {
      "type": "object",
      "description": "This is your root View",
      "allOf": [
        {
          "$ref": "#/$defs/RootWidget"
        },
        {
          "properties": {
            "onLoad": {
              "$ref": "#/$defs/Action-payload",
              "description": "Execute an Action when the page loads"
            }
          }
        }
      ]
    },
  },
  "$defs": {
    "RootWidget": {
      "type": "object",
      "properties": {
        "first_name": { "type": "string" },
        "last_name": { "type": "string" },
      }
    },
    "Action-payload": {
      "type": "object",
      "description": "Call Ensemble's built-in functions or execute code",
      "properties": {
        "action": {
          "type": "string",
          "description": "invoke an Ensemble's built-in functions",
          "enum": ["invokeAPI" ,"navigateScreen", "navigateModalScreen", "showDialog", "closeAllDialogs", "startTimer", "showToast", "executeCode"]
        }
      }
    }
  }
};

function App() {

  $RefParser.resolve(mySchema, (err, schema) => {
    if (err) {
      console.error(err);
    }
    else {
      // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
      // including referenced files, combined into a single object
      console.log(schema);
    }
  })
  
  $RefParser.dereference(mySchema, (err, schema) => {
    if (err) {
      console.error(err);
    }
    else {
      // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
      // including referenced files, combined into a single object
      console.log(schema);
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        test
      </header>
    </div>
  );
}

export default App;
