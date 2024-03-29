import React, { useState, useEffect, useRef } from 'react';
import $RefParser from "@apidevtools/json-schema-ref-parser";
import './App.css';

const mySchema = {
  "$id": "https://raw.githubusercontent.com/EnsembleUI/ensemble/cb2653724e2a01320377743a3e939ea497db5a9d/assets/schema/ensemble_schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Ensemble",
  "type": "object",
  "properties": {
    "Import": {},
    "ViewGroup": {
      "$ref": "#/$defs/Menu",
      "description": "Group multiple Views together and put them behind a menu."
    },
    "View": {
      "type": "object",
      "description": "This is your root View. It requires a body widget.",
      "required": [
        "body"
      ],
      "properties": {
        "header": {
          "type": "object",
          "description": "Configure the application header",
          "properties": {
            "title": {
              "oneOf": [{
                "type": "string"
              }, {
                "$ref": "#/$defs/Widget"
              }],
              "description": "A simple text or a custom widget for the App's title"
            },
            "flexibleBackground": {
              "$ref": "#/$defs/Widget",
              "description": "This widget (typically used as an background image) acts as the header's background, with the title bar and the bottom widget overlaid on top. On non-scrollable screen, its dimensions is dictated by the header's width and height."
            },
            "styles": {
              "type": "object",
              "properties": {
                "backgroundColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "By default the background color uses the theme's 'primary' color. You can override the header's background color here."
                },
                "color": {
                  "$ref": "#/$defs/typeColors",
                  "description": "By default the navigation icon, title, and action icons uses the theme's 'onPrimary' color. You can override their colors here."
                },
                "elevation": {
                  "type": "integer",
                  "description": "Raise the header on its z-coordinates relative to the body. This effectively creates a drop shadow on the header's bottom edge.",
                  "minimum": 0
                },
                "shadowColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "If elevation is non-zero, this will override the drop shadow color of the header's bottom edge."
                },
                "centerTitle": {
                  "type": "boolean",
                  "description": "Whether to align the title in the title bar's center horizontally (default: true)"
                },
                "titleBarHeight": {
                  "type": "integer",
                  "description": "For consistency, the header's title bar has the default fixed height of 56 regardless of its content. You may adjust its height here.",
                  "minimum": 0
                },
                "flexibleMinHeight": {
                  "type": "integer",
                  "description": "Applicable only if scrollableView is enabled. This attribute effectively sets the header's min height on scrolling (header's height will varies between the flexibleMinHeight and flexibleMaxHeight). Note that this attribute will be ignored if smaller than the titleBarHeight"
                },
                "flexibleMaxHeight": {
                  "type": "integer",
                  "description": "Applicable only if scrollableView is enabled. This attribute effectively sets the header's max height on scrolling (header's height will varies between the flexibleMinHeight and flexibleMaxHeight). This attribute will be ignored if smaller than the flexibleMinHeight"
                }
              }
            }
          }
        },
        "body": {
          "$ref": "#/$defs/Widget"
        },
        "onLoad": {
          "$ref": "#/$defs/Action-payload",
          "description": "Execute an Action when the screen loads"
        },
        "options": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "description": "Specify if this is a regular (default) or modal screen",
              "enum": [
                "regular",
                "modal"
              ]
            }
          }
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/backgroundImage"
            },
            {
              "$ref": "#/$defs/backgroundColor",
              "description": "Background color for the screen starting with '0xFF' for full opacity e.g 0xFFCCCCCC"
            },
            {
              "properties": {
                "useSafeArea": {
                  "type": "boolean",
                  "description": "Applicable only when we don't have a header. If true, insert paddings around the body content to account for the the devices' Safe Area (e.g. iPhone notch). Default is false."
                },
                "scrollableView": {
                  "type": "boolean",
                  "description": "Specify if the content of this screen is scrollable with a global scrollbar. Using this also allow you to customize the scrolling experience of the header."
                },
                "showNavigationIcon": {
                  "type": "boolean",
                  "description": "For a screen with header, the App will automatically show the Menu, Back, or Close icon (for modal screen) before the title. On modal screen without the header, the Close icon will be shown. Set this flag to false if you wish to hide the icons and handle the navigation yourself."
                },
                "navigationIconPosition": {
                  "type": "string",
                  "description": "On modal screen without a header, you can position the close button at the start or end of the screen. For left-to-right languages like English, start is on the left and end is on the right. This property has no effect on a screen with header.",
                  "enum": [
                    "start",
                    "end"
                  ]
                }
              }
            }
          ]
        }
      }
    },
    "Action": {},
    "Model": {},
    "App": {},
    "Variable": {},
    "Functions": {
      "type": "string",
      "description": "Javascript snippet for declaring variables and reusable functions, visible anywhere within this screen"
    },
    "Global": {
      "defaultSnippets": [
        {
          "label": "Define variables and functions in Javascript",
          "body": "|-\n\t//@code\n\t"
        }
      ],
      "markdownDescription": "Declare Javascript variables and functions that are visible globally within this screen.  \n//@code  \n var myGlobalVar = 'hello';  \nfunction myGlobalFunc() {  \n  }"
    },
    "API": {
      "additionalProperties": {
        "type": "object",
        "required": [
          "uri",
          "method"
        ],
        "properties": {
          "inputs": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Define the list of input names that this API accepts"
          },
          "uri": {
            "type": "string",
            "description": "The URL for this API"
          },
          "method": {
            "type": "string",
            "description": "Set the HTTP Method",
            "enum": [
              "GET",
              "PUT",
              "POST",
              "PATCH",
              "DELETE"
            ]
          },
          "parameters": {
            "type": "object",
            "description": "Specify the key/value pairs to pass along with the URL"
          },
          "body": {
            "type": "string",
            "description": "The request body to pass along with the URL"
          },
          "onResponse": {
            "$ref": "#/$defs/Action-payload",
            "description": "Execute this callback upon a successful return of the API (http code 200-299)."
          },
          "onError": {
            "$ref": "#/$defs/Action-payload",
            "description": "Execute this callback when the API returns an error."
          }
        }
      }
    }
  },
  "additionalProperties": {
    "type": "object",
    "description": "Defining a Custom Widget",
    "required": [
      "body"
    ],
    "properties": {
      "inputs": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Define the list of input names that this Custom Widget accepts."
      },
      "onLoad": {
        "$ref": "#/$defs/Action-payload",
        "description": "Execute an Action when this Custom Widget loads"
      },
      "body": {
        "$ref": "#/$defs/Widget",
        "description": "Specify a widget to render."
      }
    }
  },
  "$defs": {
    "Text-payload": {
      "type": "object",
      "required": [],
      "properties": {
        "text": {
          "type": "string",
          "description": "Your text content"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxStyles"
            },
            {
              "type": "object",
              "properties": {
                "font": {
                  "type": "string",
                  "description": "Default built-in style for this text",
                  "enum": [
                    "heading",
                    "title",
                    "subtitle"
                  ]
                },
                "fontSize": {
                  "type": "integer",
                  "minimum": 6
                },
                "fontWeight": {
                  "$ref": "#/$defs/type-fontWeight"
                },
                "color": {
                  "$ref": "#/$defs/typeColors"
                },
                "overflow": {
                  "type": "string",
                  "description": "Set treatment of text longer than available space",
                  "enum": [
                    "wrap",
                    "visible",
                    "clip",
                    "ellipsis"
                  ]
                },
                "textAlign": {
                  "type": "string",
                  "enum": [
                    "start",
                    "end",
                    "center",
                    "justify"
                  ]
                },
                "textStyle": {
                  "type": "string",
                  "enum": [
                    "normal",
                    "italic",
                    "underline",
                    "strikethrough",
                    "italic_underline",
                    "italic_strikethrough"
                  ]
                },
                "lineHeight": {
                  "oneOf": [
                    {
                      "title": "string",
                      "type": "string"
                    },
                    {
                      "title": "number",
                      "type": "number"
                    },
                    {
                      "title": "enum",
                      "enum": [
                        "default",
                        "1.0",
                        "1.15",
                        "1.25",
                        "1.5",
                        "2.0",
                        "2.5"
                      ]
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    "Markdown-payload": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "description": "Your text in markdown format"
        },
        "styles": {
          "allOf": [
            {
              "type": "object",
              "properties": {
                "textStyle": {
                  "type": "object",
                  "description": "Styling for regular text. Default to theme's bodyMedium styling",
                  "$ref": "#/$defs/TextStyle"
                },
                "linkStyle": {
                  "type": "object",
                  "description": "Styling for URL",
                  "$ref": "#/$defs/TextStyle"
                }
              }
            },
            {
              "$ref": "#/$defs/baseStyles"
            }
          ]
        }
      }
    },
    "Html-payload": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "description": "Enter the HTML text"
        }
      }
    },
    "Icon-payload": {
      "type": "object",
      "required": [
        "icon"
      ],
      "properties": {
        "icon": {
          "type": "string",
          "description": "Icon name from Material Icons or Font Awesome"
        },
        "library": {
          "type": "string",
          "enum": [
            "default",
            "fontAwesome"
          ]
        },
        "onTap": {
          "$ref": "#/$defs/Action-payload",
          "description": "Call Ensemble's built-in functions or execute code"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxStylesWithoutDimension"
            },
            {
              "type": "object",
              "properties": {
                "size": {
                  "type": "integer"
                },
                "color": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The color of the icon"
                },
                "splashColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "If onTap is defined, this color will show up as a splash effect upon tapping the icon. Note that the effect only happens if backgroundColor is not set."
                }
              }
            }
          ]
        }
      }
    },
    "Image-payload": {
      "type": "object",
      "required": [
        "source"
      ],
      "properties": {
        "source": {
          "type": "string",
          "description": "URL to or asset name of the image. If the URL is used, it is highly recommended that the dimensions is set (either with width/height or other means) to prevent the UI jerkiness while loading."
        },
        "onTap": {
          "$ref": "#/$defs/Action-payload",
          "description": "Call Ensemble's built-in functions or execute code"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxStyles"
            },
            {
              "type": "object",
              "properties": {
                "placeholderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The placeholder color while the image is loading."
                },
                "fit": {
                  "type": "string",
                  "description": "How to fit the image within our width/height or our parent (if dimension is not specified)",
                  "oneOf": [
                    {
                      "const": "fill",
                      "description": "Stretch our image to fill the dimension, and distorting the aspect ratio if needed"
                    },
                    {
                      "const": "contain",
                      "description": "Scale the image such that the entire image is contained within our dimension"
                    },
                    {
                      "const": "cover",
                      "description": "Scale the image to fill our dimension, clipping the image as needed"
                    },
                    {
                      "const": "fitWidth",
                      "description": "Scale the image to fit the width, and clipping the height if needed"
                    },
                    {
                      "const": "fitHeight",
                      "description": "Scale the image to fit the height, and clipping the width if needed"
                    },
                    {
                      "const": "none",
                      "description": "Center-Align the original image size, clipping the content if needed"
                    },
                    {
                      "const": "scaleDown",
                      "description": "Center-Align the image and only scale down to fit. Image will not be scaled up to bigger dimension."
                    }
                  ]
                },
                "resizedWidth": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 2000,
                  "description": "Images will be automatically resized (default to 800 width with no height set) before rendering. If you know the rough image width, set this number to be the same or a slightly larger width to optimize the loading time. To maintain the original aspect ratio, set either resizedWidth or resizedHeight, but not both. This setting is not supported on Web."
                },
                "resizedHeight": {
                  "type": "integer",
                  "minimum": 0,
                  "maximum": 2000,
                  "description": "Images will be automatically resized (default to 800 width with no height set) before rendering. If you know the rough image height, set this number to be the same or a slightly larger height to optimize the loading time. To maintain the original aspect ratio, set either resizedWidth or resizedHeight, but not both. This setting is not supported on Web."
                }
              }
            }
          ]
        }
      }
    },
    "Lottie-payload": {
      "type": "object",
      "required": [
        "source"
      ],
      "properties": {
        "source": {
          "type": "string",
          "description": "URL or asset name of the Lottie json file"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxStyles"
            },
            {
              "type": "object",
              "properties": {
                "width": {
                  "type": "integer"
                },
                "height": {
                  "type": "integer"
                },
                "repeat": {
                  "type": "boolean",
                  "description": "Whether we should repeat the animation (default true)"
                },
                "fit": {
                  "type": "string",
                  "description": "How to fit the Lottie animation within our width/height or our parent (if dimension is not specified)",
                  "oneOf": [
                    {
                      "const": "fill",
                      "description": "Stretch our Lottie to fill the dimension, and distorting the aspect ratio if needed"
                    },
                    {
                      "const": "contain",
                      "description": "Scale the Lottie such that the entire Lottie is contained within our dimension"
                    },
                    {
                      "const": "cover",
                      "description": "Scale the Lottie to fill our dimension, clipping the Lottie as needed"
                    },
                    {
                      "const": "fitWidth",
                      "description": "Scale the Lottie to fit the width, and clipping the height if needed"
                    },
                    {
                      "const": "fitHeight",
                      "description": "Scale the Lottie to fit the height, and clipping the width if needed"
                    },
                    {
                      "const": "none",
                      "description": "Center-Align the original Lottie size, clipping the content if needed"
                    },
                    {
                      "const": "scaleDown",
                      "description": "Center-Align the Lottie and only scale down to fit. Lottie will not be scaled up to bigger dimension."
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    },
    "QRCode-payload": {
      "type": "object",
      "required": [
        "value"
      ],
      "properties": {
        "value": {
          "type": "string",
          "description": "The data to generate the QR code"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxStylesWithoutDimension"
            },
            {
              "type": "object",
              "properties": {
                "size": {
                  "type": "integer",
                  "description": "Specify the width/height of the QR Code. Default: 160"
                },
                "color": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the color for the QR code drawing"
                }
              }
            }
          ]
        }
      }
    },
    "Progress-payload": {
      "type": "object",
      "properties": {
        "display": {
          "type": "string",
          "enum": [
            "linear",
            "circular"
          ]
        },
        "countdown": {
          "type": "integer",
          "minimum": 0,
          "description": "Show the progress percentage based on the number of seconds specified here"
        },
        "onCountdownComplete": {
          "$ref": "#/$defs/Action-payload",
          "description": "Execute this Action when the countdown comes to 0"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/backgroundColor"
            },
            {
              "type": "object",
              "properties": {
                "size": {
                  "type": "integer",
                  "minimum": 10,
                  "description": "Specifies the width (progress bar) or the diameter (circular progress indicator)"
                },
                "thickness": {
                  "type": "integer",
                  "minimum": 1,
                  "description": "Specifies the thickness of the indicator (for progress bar this is the height)"
                },
                "color": {
                  "$ref": "#/$defs/typeColors"
                }
              }
            }
          ]
        }
      }
    },
    "Divider-payload": {
      "type": "object",
      "properties": {
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/styleMargin"
            },
            {
              "type": "object",
              "properties": {
                "direction": {
                  "type": "string",
                  "description": "Whether to display a horizontal divider (default) or vertical divider.",
                  "enum": [
                    "horizontal",
                    "vertical"
                  ]
                },
                "thickness": {
                  "type": "integer"
                },
                "color": {
                  "oneOf": [
                    {
                      "title": "string",
                      "type": "string"
                    },
                    {
                      "title": "number",
                      "type": "number"
                    }
                  ],
                  "description": "The line color starting with '0xFF' for full opacity"
                },
                "indent": {
                  "type": "integer",
                  "description": "The leading gap before the line starts"
                },
                "endIndent": {
                  "type": "integer",
                  "description": "The ending gap after the line ends"
                }
              }
            }
          ]
        }
      }
    },
    "Spacer-payload": {
      "type": "object",
      "properties": {
        "styles": {
          "type": "object",
          "properties": {
            "size": {
              "type": "integer"
            }
          }
        }
      }
    },
    "TextInput-payload": {
      "allOf": [
        {
          "$ref": "#/$defs/FormInput-payload"
        },
        {
          "$ref": "#/$defs/inputValidator"
        },
        {
          "type": "object",
          "properties": {
            "onKeyPress": {
              "$ref": "#/$defs/Action-payload",
              "description": "On every keystroke, call Ensemble's built-in functions or execute code"
            },
            "value": {
              "type": "string",
              "description": "Specifying the value of your Text Input"
            },
            "inputType": {
              "type": "string",
              "description": "Pick a predefined input type",
              "enum": [
                "default",
                "email",
                "phone",
                "ipAddress"
              ]
            },
            "keyboardAction": {
              "$ref": "#/$defs/keyboardAction"
            },
            "obscureText": {
              "type": "boolean",
              "description": "whether we should obscure the typed-in text (e.g Social Security)"
            },
            "obscureToggle": {
              "type": "boolean",
              "description": "enable the toggling between plain and obscure text."
            },
            "styles": {
              "type": "object",
              "properties": {
                "fontSize": {
                  "type": "integer",
                  "minimum": 6
                }
              }
            }
          }
        }
      ]
    },
    "PasswordInput-payload": {
      "allOf": [
        {
          "$ref": "#/$defs/FormInput-payload"
        },
        {
          "$ref": "#/$defs/inputValidator"
        },
        {
          "type": "object",
          "properties": {
            "onKeyPress": {
              "$ref": "#/$defs/Action-payload",
              "description": "On every keystroke, call Ensemble's built-in functions or execute code"
            },
            "keyboardAction": {
              "$ref": "#/$defs/keyboardAction"
            },
            "obscureToggle": {
              "type": "boolean",
              "description": "enable the toggling between plain and obscure text."
            },
            "styles": {
              "type": "object",
              "properties": {
                "fontSize": {
                  "type": "integer",
                  "minimum": 6
                }
              }
            }
          }
        }
      ]
    },
    "OnOff-payload": {
      "allOf": [
        {
          "$ref": "#/$defs/FormInput-payload"
        },
        {
          "type": "object",
          "properties": {
            "value": {
              "type": "boolean"
            },
            "leadingText": {
              "type": "string"
            },
            "trailingText": {
              "type": "string"
            }
          }
        }
      ]
    },
    "SelectOne-payload": {
      "allOf": [
        {
          "$ref": "#/$defs/FormInput-payload"
        },
        {
          "type": "object",
          "properties": {
            "value": {
              "description": "Select a value that matches one of the items. If Items are Objects, it should match the value key",
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "oneOf": [{
                  "type": "object",
                  "properties": {
                    "value": {
                      "type": "string"
                    },
                    "label": {
                      "type": "string"
                    }
                  }
                }, {
                  "type": "string"
                }]
              },
              "description": "List of values, or Objects with value/label pairs"
            },
            "autoComplete": {
              "type": "boolean",
              "description": "Enable the Input search suggestion option"
            }
          }
        }
      ]
    },
    "Date-payload": {
      "allOf": [
        {
          "$ref": "#/$defs/FormInput-payload"
        },
        {
          "type": "object",
          "properties": {
            "initialValue": {
              "type": "string",
              "description": "The highlighted initial date in the calendar picker (default is Today). Use format YYYY-MM-DD."
            },
            "firstDate": {
              "type": "string",
              "description": "The first selectable date in the calendar. Use format YYYY-MM-DD"
            },
            "lastDate": {
              "type": "string",
              "description": "The last selectable date in the calendar. Use format YYYY-MM-DD"
            },
            "showCalendarIcon": {
              "type": "boolean",
              "description": "Whether we should show (default) or hide the calendar icon. Selecting the text will still open the calendar picker"
            }
          }
        }
      ]
    },
    "Time-payload": {
      "allOf": [
        {
          "$ref": "#/$defs/FormInput-payload"
        },
        {
          "type": "object",
          "properties": {
            "initialValue": {
              "type": "string",
              "description": "The highlighted initial time in the time picker. Use format HH:MM"
            }
          }
        }
      ]
    },
    "Button-payload": {
      "type": "object",
      "properties": {
        "label": {
          "type": "string",
          "description": "The button label"
        },
        "startingIcon": {
          "$ref": "#/$defs/HasIcon",
          "description": "Icon placed in front of the label, according to device text alignment"
        },
        "endingIcon": {
          "$ref": "#/$defs/HasIcon",
          "description": "Icon placed behind the label, according to device text alignment"
        },
        "enabled": {
          "type": "boolean"
        },
        "submitForm": {
          "type": "boolean",
          "description": "If the button is inside a Form and upon on tap, it will execute the form's onSubmit action if this property is TRUE"
        },
        "onTap": {
          "$ref": "#/$defs/Action-payload",
          "description": "Call Ensemble's built-in functions or execute code"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxStyles"
            },
            {
              "type": "object",
              "properties": {
                "outline": {
                  "type": "boolean",
                  "description": "Whether the button should have an outline border instead of filled background"
                },
                "color": {
                  "oneOf": [
                    {
                      "title": "string",
                      "type": "string"
                    },
                    {
                      "title": "number",
                      "type": "number"
                    }
                  ],
                  "description": "Set the color for the button label starting with '0xFF' for full opacity"
                },
                "fontSize": {
                  "type": "integer",
                  "minimum": 6
                },
                "fontWeight": {
                  "$ref": "#/$defs/type-fontWeight"
                }
              }
            }
          ]
        }
      }
    },
    "ToggleButton-payload": {
      "type": "object",
      "properties": {
        "value": {
          "description": "Set a default value that matches one of the items. If Items are Objects, it should match the value key"
        },
        "items": {
          "type": "array",
          "description": "List of values, or Objects with value/label pairs"
        },
        "onChange": {
          "$ref": "#/$defs/Action-payload",
          "description": "Call Ensemble's built-in functions or execute code when the input changes. Note for free-form text input, this event only dispatches if the text changes AND the focus is lost (e.g. clicking on button)"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "type": "object",
              "properties": {
                "spacing": {
                  "type": "integer",
                  "description": "Space between the toggle buttons item",
                  "minimum": 0
                },
                "runSpacing": {
                  "type": "integer",
                  "description": "Space between the toggle buttons row",
                  "minimum": 0
                },
                "color": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the color for the toggle button label starting with '0xFF' for full opacity"
                },
                "selectedColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the color for the selected toggle button label"
                },
                "backgroundColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the background color for the toggle button"
                },
                "selectedBackgroundColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the background color for the selected toggle button"
                },
                "borderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the border color for the toggle button, starting with '0xFF' for full opacity"
                },
                "selectedBorderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the border color for the selected toggle button, starting with '0xFF' for full opacity"
                },
                "shadowColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "Set the shadow color for the toggle button"
                }
              }
            }
          ]
        }
      }
    },
    "Form-payload": {
      "type": "object",
      "required": ["children"],
      "properties": {
        "enabled": {
          "type": "boolean"
        },
        "onSubmit": {
          "$ref": "#/$defs/Action-payload",
          "description": "Action to execute when the form is submitted"
        },
        "children": {
          "$ref": "#/$defs/Widgets"
        },
        "styles": {
          "type": "object",
          "properties": {
            "labelPosition": {
              "type": "string",
              "description": "Where the position the FormField's label",
              "enum": [
                "top",
                "start",
                "none"
              ]
            },
            "labelOverflow": {
              "type": "string",
              "description": "Treatment of text longer than available space",
              "enum": [
                "wrap",
                "visible",
                "clip",
                "ellipsis"
              ]
            },
            "labelMaxWidth": {
              "type": "integer",
              "description": "Cap the label's width, useful on larger screen. This property only works on labelPosition=start."
            },
            "width": {
              "type": "integer",
              "minimum": 0
            },
            "height": {
              "type": "integer",
              "minimum": 0
            },
            "gap": {
              "type": "integer",
              "description": "Vertical gap to insert between the children (default is 10)",
              "minimum": 0
            }
          }
        }
      }
    },
    "Flow-payload": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/$defs/Templated-payload"
        },
        {
          "required": ["children"],
          "properties": {
            "children": {
              "$ref": "#/$defs/Widgets"
            },
            "direction": {
              "type": "string",
              "description": "The main direction to lay out the children before wrapping",
              "enum": [
                "vertical",
                "horizontal"
              ]
            },
            "styles": {
              "$ref": "#/$defs/flowStyles"
            }
          }
        }
      ]
    },
    "Column-payload": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/$defs/Templated-payload"
        },
        {
          "properties": {
            "children": {
              "$ref": "#/$defs/Widgets"
            },
            "styles": {
              "$ref": "#/$defs/columnStyles"
            }
          }
        }
      ]
    },
    "Row-payload": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/$defs/Templated-payload"
        },
        {
          "properties": {
            "children": {
              "$ref": "#/$defs/Widgets"
            },
            "styles": {
              "$ref": "#/$defs/rowStyles"
            }
          }
        }
      ]
    },
    "GridView-payload": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/$defs/Templated-payload"
        },
        {
          "properties": {
            "onItemTap": {
              "$ref": "#/$defs/Action-payload",
              "description": "Call Ensemble's built-in functions or execute code when tapping on an item in the list."
            },
            "styles": {
              "allOf": [
                {
                  "$ref": "#/$defs/baseStyles"
                },
                {
                  "$ref": "#/$defs/boxLayoutStyles"
                },
                {
                  "properties": {
                    "horizontalTileCount": {
                      "oneOf": [
                        {
                          "title": "string",
                          "type": "string"
                        },
                        {
                          "title": "integer",
                          "type": "integer",
                          "minimum": 1,
                          "maximum": 5
                        }
                      ],
                      "description": "The number of horizontal tiles (max 5) to show. If not specified, the number of tiles will automatically be determined by the screen size. You may also specify a single number (for all breakpoints), three numbers (for small, medium, large breakpoints), or five numbers (xSmall, small, medium, large, xLarge)."
                    },
                    "horizontalGap": {
                      "type": "integer",
                      "description": "The gap between the horizontal tiles if there are more than one (default: 10).",
                      "minimum": 0
                    },
                    "verticalGap": {
                      "type": "integer",
                      "description": "The gap between the vertical tiles if there are more than one (default: 10).",
                      "minimum": 0
                    },
                    "itemHeight": {
                      "type": "integer",
                      "description": "Set a fixed height for each item in the tile. If each tile item comprises of many widgets vertically, setting this attribute may require you to stretch (expand) at least one inner widget.",
                      "minimum": 0
                    },
                    "itemAspectRatio": {
                      "type": "number",
                      "description": "Instead of itemHeight, you can set the tile's dimension as a ratio of (item width / item height). For example, a tile with 3x width and 2x height is 3/2 = 1.5. This attribute will be ignored if itemHeight is set.",
                      "minimum": 0
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    },
    "Flex-payload": {
      "type": "object",
      "allOf": [
        {
          "properties": {
            "children": {
              "$ref": "#/$defs/Widgets"
            },
            "styles": {
              "$ref": "#/$defs/flexStyles"
            }
          }
        },
        {
          "$ref": "#/$defs/Templated-payload"
        }
      ]
    },
    "DataGrid-payload": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/$defs/DataRow-Templated-payload"
        },
        {
          "properties": {
            "children": {
                "$ref": "#/$defs/DataRow"
            },
            "styles": {
              "allOf": [
                {
                  "$ref": "#/$defs/baseStyles"
                },
                {
                  "$ref": "#/$defs/boxLayoutStyles"
                },
                {
                  "headingTextStyle": {
                    "type": "object",
                    "description": "Set the text style for the heading text",
                    "$ref": "#/$defs/TextStyle"
                  },
                  "dataTextStyle": {
                    "type": "object",
                    "description": "Set the text style for the data item text",
                    "$ref": "#/$defs/TextStyle"
                  }
                }
              ]
            },
            "horizontalMargin": {
              "type": "integer",
              "description": "The leading and trailing gap for the DataGrid view.",
              "minimum": 0
            },
            "dataRowHeight": {
              "type": "integer",
              "description": "Set the height of the data row item.",
              "minimum": 0
            },
            "headingRowHeight": {
              "type": "integer",
              "description": "Set the height of the heading row item.",
              "minimum": 0
            },
            "columnSpacing": {
              "type": "number",
              "description": "Set the padding for the column.",
              "minimum": 0
            }
          }
        }
      ]
    },
    "DataRow-Templated-payload": {
      "type": "object",
      "properties": {
        "item-template": {
          "type": "object",
          "properties": {
            "data": {
              "type": "string",
              "description": "Bind to an array of data from an API response or a variable"
            },
            "name": {
              "type": "string",
              "description": "Set the name to reference as you iterate through the array of data"
            },
            "template": {
              "$ref": "#/$defs/DataRow",
              "description": "The data row widget to render for each item"
            }
          }
        }
      }
    },
    "DataRow": {
      "type": "array",
      "description": "List of widgets",
      "items": {
        "$ref": "#/$defs/Widget"
      }
    },
    "Stack-payload": {
      "type": "object",
      "required": ["children"],
      "properties": {
        "children": {
          "$ref": "#/$defs/Widgets"
        },
        "styles": {
          "type": "object",
          "properties": {
            "alignment": {
              "$ref": "#/$defs/alignment"
            }
          }
        }
      }
    },
    "ListView-payload": {
      "type": "object",
      "allOf": [
        {
          "$ref": "#/$defs/Templated-payload"
        },
        {
          "required": ["children"],
          "properties": {
            "children": {
              "$ref": "#/$defs/Widgets"
            },
            "onItemTap": {
              "description": "Dispatch when an ListView item is selected/tapped.The event dispatches only when you tap on the item. The index of the item can be retrieved using 'selectedItemIndex'.",
              "$ref": "#/$defs/Action-payload"
            },
            "selectedItemIndex": {
              "type": "integer",
              "description": "Selecting a ListView item gives the index of selected item"
            },
            "styles": {
              "allOf": [
                {
                  "$ref": "#/$defs/boxLayoutStyles"
                },
                {
                  "$ref": "#/$defs/baseStyles"
                },
                {
                  "type": "object",
                  "properties": {
                    "showSeparator": {
                      "type": "boolean",
                      "description": "Show a separator between the items (default is true)."
                    },
                    "separatorColor": {
                      "$ref": "#/$defs/typeColors",
                      "description": "Set the color for the separator between items"
                    },
                    "separatorWidth": {
                      "type": "integer",
                      "description": "The thickness of the separator between items"
                    },
                    "separatorPadding": {
                      "oneOf": [
                        {
                          "title": "string",
                          "type": "string"
                        },
                        {
                          "title": "integer",
                          "type": "integer"
                        }
                      ],
                      "description": "Padding with CSS-style value e.g. padding: 5 20 5 Default 0 0 0"
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    },
    "Carousel-payload": {
      "type": "object",
      "allOf": [
        {
          "required": ["children"],
          "properties": {
            "children": {
              "$ref": "#/$defs/Widgets"
            },
            "onItemChange": {
              "description": "Dispatch when an carousel item is in focus. For SingleView, this happens when the item is scroll into view. For scrolling MultiView, the event dispatches only when you tap on the item. The index of the item can be retrieved using 'selectedIndex'.",
              "$ref": "#/$defs/Action-payload"
            },
            "styles": {
              "allOf": [
                {
                  "$ref": "#/$defs/boxStylesWithoutDimension"
                },
                {
                  "type": "object",
                  "properties": {
                    "layout": {
                      "type": "string",
                      "description": "Show a SingleView (on screen one at a time), MultiView (scrolling items), or automatically switch between the views with autoLayoutBreakpoint",
                      "enum": [
                        "auto",
                        "single",
                        "multiple"
                      ]
                    },
                    "autoLayoutBreakpoint": {
                      "type": "integer",
                      "description": "Show multiple views on the carousel if the breakpoint is equal or larger than this threshold, otherwise show single view. (default 768)"
                    },
                    "height": {
                      "type": "integer",
                      "description": "The height of each view"
                    },
                    "gap": {
                      "type": "integer",
                      "description": "The gap between each views, but also act as a left-right margin in a single view"
                    },
                    "leadingGap": {
                      "type": "integer",
                      "description": "The space before the first item. Note that the left edge of the scroll area is still controlled by padding or margin."
                    },
                    "trailingGap": {
                      "type": "integer",
                      "description": "The space after the last item. Note that the right edge of the scroll area is still controlled by padding or margin."
                    },
                    "singleItemWidthRatio": {
                      "type": "number",
                      "description": "The screen width ratio for each carousel item (in single item mode). Value ranges from 0.0 to 1.0 for the full width. (default 1.0)",
                      "minimum": 0,
                      "maximum": 1
                    },
                    "multipleItemWidthRatio": {
                      "type": "number",
                      "description": "The screen width ratio for each carousel item (in multiple item mode). Value ranges from 0.0 to 1.0 for the full width (default 0.6)",
                      "minimum": 0,
                      "maximum": 1
                    },
                    "indicatorType": {
                      "type": "string",
                      "description": "How the view indicator should be displayed",
                      "enum": [
                        "none",
                        "circle",
                        "rectangle"
                      ]
                    },
                    "indicatorPosition": {
                      "type": "string",
                      "description": "Where to display the indicator if specified",
                      "enum": [
                        "bottom",
                        "top"
                      ]
                    },
                    "indicatorWidth": {
                      "type": "integer"
                    },
                    "indicatorHeight": {
                      "type": "integer"
                    },
                    "indicatorMargin": {
                      "oneOf": [
                        {
                          "title": "string",
                          "type": "string"
                        },
                        {
                          "title": "integer",
                          "type": "integer"
                        }
                      ],
                      "description": "The margin around each indicator"
                    }
                  }
                }
              ]
            }
          }
        },
        {
          "$ref": "#/$defs/Templated-payload"
        }
      ]
    },
    "Templated-payload": {
      "type": "object",
      "properties": {
        "item-template": {
          "type": "object",
          "required": ["template"],
          "properties": {
            "data": {
              "type": "string",
              "description": "Bind to an array of data from an API response or a variable"
            },
            "name": {
              "type": "string",
              "description": "Set the name to reference as you iterate through the array of data"
            },
            "template": {
              "$ref": "#/$defs/Widget",
              "description": "The widget to render for each item"
            }
          }
        }
      }
    },
    "FormInput-payload": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "ID to be referenced later"
        },
        "maxWidth": {
          "type": "integer",
          "description": "The max width of this Input widget (default 700)",
          "minimum": 0,
          "maximum": 5000
        },
        "label": {
          "type": "string",
          "description": "Label for your widget"
        },
        "labelHint": {
          "type": "string",
          "description": "Hint text on your label"
        },
        "hintText": {
          "type": "string",
          "description": "Hint text explaining your widget"
        },
        "required": {
          "type": "boolean"
        },
        "enabled": {
          "type": "boolean"
        },
        "icon": {
          "$ref": "#/$defs/HasIcon",
          "description": "The icon to show before the Input field"
        },
        "onChange": {
          "$ref": "#/$defs/Action-payload",
          "description": "Call Ensemble's built-in functions or execute code when the input changes. Note for free-form text input, this event only dispatches if the text changes AND the focus is lost (e.g. clicking on button)"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "type": "object",
              "properties": {
                "variant": {
                  "type": "string",
                  "description": "Select a pre-defined look and feel for this Input widget. This property can be defined in the theme to apply to all Input widgets.",
                  "oneOf": [
                    {
                      "const": "underline",
                      "description": "draw an Underline below this input widget. This property can be defined in the theme to apply to all Input widgets."
                    },
                    {
                      "const": "box",
                      "description": "draw a Box border around this input widget. This property can be defined in the theme to apply to all Input widgets."
                    }
                  ]
                },
                "contentPadding": {
                  "oneOf": [
                    {
                      "title": "string",
                      "type": "string"
                    },
                    {
                      "title": "integer",
                      "type": "integer"
                    }
                  ],
                  "description": "Padding around your input content with CSS-style notation e.g. margin: 5 20 5"
                },
                "fillColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The fill color for this input fields. This property can be defined in the theme to apply to all Input widgets."
                },
                "borderRadius": {
                  "type": "integer",
                  "minimum": 0,
                  "description": "The border radius for this Input widget. This property can be defined in the theme to apply to all Input widgets."
                },
                "borderWidth": {
                  "type": "integer",
                  "minimum": 0,
                  "description": "The border width for this Input widget. This property can be defined in the theme to apply to all Input widgets."
                },
                "borderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The base border color for this input widget. This border color determines the look and feel of your input, while the other colors are overrides for different states. This property can be defined in the theme to apply to all Input widgets."
                },
                "disabledBorderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The border color when this input field is disabled. This property can be defined in the theme to apply to all Input widgets."
                },
                "errorBorderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The border color when there are errors on this input field. This property can be defined in the theme to apply to all Input widgets."
                },
                "focusedBorderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The border color when this input field is receiving focus. This property can be defined in the theme to apply to all Input widgets."
                },
                "focusedErrorBorderColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The border color of this input field when it is receiving focus in its error state. This property can be defined in the theme to apply to all Input widgets."
                }
              }
            }
          ]
        }
      }
    },
    "keyboardAction": {
      "type": "string",
      "description": "Specify the action key on native device's soft keyboard",
      "oneOf": [
        {
          "const": "done",
          "description": "show the keyboard action that represents completion (e.g. Android's checkmark, iOS's Done)"
        },
        {
          "const": "go",
          "description": "show the keyboard action that represents go (e.g. Android's right arrow, iOS's Done)"
        },
        {
          "const": "search",
          "description": "show the keyboard action that represents search"
        },
        {
          "const": "send",
          "description": "show the keyboard action that represents send"
        },
        {
          "const": "next",
          "description": "Move the focus to the next focusable field"
        },
        {
          "const": "previous",
          "description": "Move the focus to the previous focusable field"
        }
      ]
    },
    "Action-payload": {
      "oneOf": [
        {
          "title": "Navigate Back",
          "type": "object",
          "required": ["navigateBack"],
          "properties": {
            "navigateBack": {
              "type": "object",
              "description": "Navigating back to the previous screen if possible. The current screen will be removed from the navigation history. This also works for a modal screen."
            }
          }
        },
        {
          "title": "Navigate Screen",
          "type": "object",
          "required": ["navigateScreen"],
          "properties": {
            "navigateScreen": {
              "type": "object",
              "description": "Navigating to a new screen",
              "required": [
                "name"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Enter the Name or ID of your Screen"
                },
                "inputs": {
                  "type": "object",
                  "description": "Specify the key/value pairs to pass into the next Screen"
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "replaceCurrentScreen": {
                      "type": "boolean",
                      "description": "If true, the new screen will replace the current screen on the navigation history. Navigating back from the new screen will skip the current screen."
                    },
                    "clearAllScreens": {
                      "type": "boolean",
                      "description": "If true, clear out all existing screens in the navigation history. This is useful when navigating to a Logout or similar page where users should not be able to go back to the prior screens."
                    }
                  }
                }
              }
            }
          }
        },
        {
          "title": "Navigate Modal Screen",
          "type": "object",
          "required": ["navigateModalScreen"],
          "properties": {
            "navigateModalScreen": {
              "type": "object",
              "description": "Navigating to a new screen as a modal",
              "required": [
                "name"
              ],
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Enter the Name or ID of your screen"
                },
                "inputs": {
                  "type": "object",
                  "description": "Specify the key/value pairs to pass into the next Screen"
                },
                "onModalDismiss": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when the modal screen is dismissed"
                }
              }
            }
          }
        },
        {
          "title": "Invoke API",
          "type": "object",
          "required": ["invokeAPI"],
          "properties": {
            "invokeAPI": {
              "type": "object",
              "description": "Calling an API",
              "required": [
                "name"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Give the API an ID allows you to bind to its result. e.g. ${apiId.body...}"
                },
                "name": {
                  "type": "string",
                  "description": "Enter the name of your defined API"
                },
                "inputs": {
                  "type": "object",
                  "description": "Specify the key/value pairs to pass to the API"
                },
                "onResponse": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute another Action upon API's successful response"
                },
                "onError": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when the API completes with error(s)"
                }
              }
            }
          }
        },
        {
          "title": "Open Camera",
          "type": "object",
          "required": ["openCamera"],
          "properties": {
            "openCamera": {
              "type": "object",
              "description": "Open Camera",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Give the camera an ID, allows you to bind to its result. e.g. ${cameraId.files...}"
                },
                "onComplete": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action after completing capturing media"
                },
                "onClose": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action on camera close"
                },
                "onCapture": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action on each capture"
                },
                "options": {
                  "type": "object",
                  "mode": {
                    "type": "string",
                    "description": "Modes of camera. It can be photo only i.e allows to capture just photo. Similarly video or can be both.",
                    "enum": [
                      "photo",
                      "video",
                      "both"
                    ]
                  },
                  "initialCamera": {
                    "type": "string",
                    "description": "Initialize either camera, back or front",
                    "enum": [
                      "back",
                      "front"
                    ]
                  },
                  "allowGalleryPicker": {
                    "type": "boolean",
                    "description": "Allow users to pick media from gallery. Default (true)."
                  },
                  "allowCameraRotate": {
                    "type": "boolean",
                    "description": "Allow users rotate camera i.e back and front. Default (true)."
                  },
                  "allowFlashControl": {
                    "type": "boolean",
                    "description": "Allow users to control flash options. Default (true)."
                  },
                  "preview": {
                    "type": "boolean",
                    "description": "If set true, users can view captured/selected media."
                  },
                  "maxCount": {
                    "type": "number",
                    "description": "It used to control number of media that can be captured/selected"
                  },
                  "maxCountMessage": {
                    "type": "string",
                    "description": "Custom message to show when captured/selected media is greater than maxCount"
                  },
                  "permissionDeniedMessage": {
                    "type": "string",
                    "description": "Set custom message when access to camera is denied"
                  },
                  "nextButtonLabel": {
                    "type": "string",
                    "description": "Set custom label on next button."
                  },
                  "cameraRotateIcon": {
                    "$ref": "#/$defs/Icon-payload",
                    "description": "Set custom icon for camera rotate button"
                  },
                  "galleryPickerIcon": {
                    "$ref": "#/$defs/Icon-payload",
                    "description": "Set custom icon for gallery picker button"
                  },
                  "focusIcon": {
                    "$ref": "#/$defs/Icon-payload",
                    "description": "Set custom icon for focus widget."
                  },
                  "assistAngle": {
                    "type": "object",
                    "description": "Show assist message whenever angle goes below minAngle or above minAngle",
                    "properties": {
                      "minAngle": {
                        "type": "number",
                        "description": "Minimum angle "
                      },
                      "maxAngle": {
                        "type": "number",
                        "description": "Maximum angle "
                      },
                      "maxAngleassistAngleMessage": {
                        "type": "number",
                        "description": "Custom message to show when condition is hit."
                      }
                    }
                  },
                  "assistSpeed": {
                    "type": "object",
                    "description": "Show assist message whenever camera is moving faster than maxSpeed",
                    "properties": {
                      "maxSpeed": {
                        "type": "number",
                        "description": "Maxium speed in km/hr."
                      },
                      "assistSpeedMessage": {
                        "type": "number",
                        "description": "Custom message to show when condition is hit."
                      }
                    }
                  },
                  "autoCaptureInterval": {
                    "type": "integer",
                    "description": "If set any number n, on each n interval camera will capture"
                  }
                }
              }
            }
          }
        },
        {
          "title": "Show Dialog",
          "type": "object",
          "required": ["showDialog"],
          "properties": {
            "showDialog": {
              "type": "object",
              "description": "Opening a dialog",
              "required": [
                "widget"
              ],
              "properties": {
                "widget": {
                  "$ref": "#/$defs/Widget",
                  "description": "Return an inline widget or specify a custom widget's name to use in the dialog."
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "minWidth": {
                      "type": "integer",
                      "minimum": 0
                    },
                    "maxWidth": {
                      "type": "integer"
                    },
                    "minHeight": {
                      "type": "integer",
                      "minimum": 0
                    },
                    "maxHeight": {
                      "type": "integer"
                    },
                    "horizontalOffset": {
                      "description": "Offset the dialog's position horizontally, with -1.0 for the screen's left and 1.0 for the screen's right. (default is 0 for centering horizontally)",
                      "type": "number",
                      "minimum": -1.0,
                      "maximum": 1.0
                    },
                    "verticalOffset": {
                      "description": "Offset the dialog's position vertically, with -1.0 for the screen's top and 1.0 for the screen's bottom. (default is 0 for centering vertically)",
                      "type": "number",
                      "minimum": -1.0,
                      "maximum": 1.0
                    },
                    "style": {
                      "type": "string",
                      "description": "Render the dialog with a default style. You can also specify 'none' and control your own styles in your widget.",
                      "enum": [
                        "default",
                        "none"
                      ]
                    }
                  }
                },
                "onDialogDismiss": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when the dialog is dismissed."
                }
              }
            }
          }
        },
        {
          "title": "Close All Dialogs",
          "type": "object",
          "required": ["closeAllDialogs"],
          "properties": {
            "closeAllDialogs": {
              "type": "object",
              "description": "Closing all opened dialogs"
            }
          }
        },
        {
          "title": "Start Timer",
          "type": "object",
          "required": ["startTimer"],
          "properties": {
            "startTimer": {
              "type": "object",
              "description": "Initiating the start of a timer",
              "required": [
                "onTimer"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Give this timer an ID so it can be cancelled by a stopTimer action"
                },
                "onTimer": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action every time the timer triggers"
                },
                "onTimerComplete": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when the timer has completed and will terminate"
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "isGlobal": {
                      "type": "boolean",
                      "description": "Marking this timer as global will ensure the timer, if repeating indefinitely, will continue to run even if the user navigates away from the screen, until explicitly stopped by the stopTimer action. Note that there can only ever be one global timer. Creating a new global timer will automatically cancel the previous global timer."
                    },
                    "startAfter": {
                      "type": "integer",
                      "minimum": 0,
                      "description": "Delay the timer's start by this number of seconds. If not specified and repeat is true, repeatInterval will be used. If none is specified, there will be no initial delay"
                    },
                    "repeat": {
                      "type": "boolean",
                      "description": "Whether the time should repeat and trigger at every repeatInterval seconds. This Timer will run continuously unless a maxNumberOfTimes is specified"
                    },
                    "repeatInterval": {
                      "type": "integer",
                      "minimum": 1,
                      "description": "Trigger the timer periodically at this repeatInterval (in seconds)"
                    },
                    "maxNumberOfTimes": {
                      "type": "integer",
                      "minimum": 1,
                      "description": "Set the max number of times the timer will triggers, if repeat is true"
                    }
                  }
                }
              }
            }
          }
        },
        {
          "title": "Stop Timer",
          "type": "object",
          "required": ["stopTimer"],
          "properties": {
            "stopTimer": {
              "type": "object",
              "description": "Stop a timer if it is running",
              "required": [
                "id"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Stop the timer with this ID if it is running"
                }
              }
            }
          }
        },
        {
          "title": "Show Toast",
          "type": "object",
          "required": ["showToast"],
          "properties": {
            "showToast": {
              "type": "object",
              "description": "Showing a toast message",
              "oneOf": [
                {
                  "required": [
                    "message"
                  ]
                },
                {
                  "required": [
                    "widget"
                  ]
                }
              ],
              "properties": {
                "message": {
                  "type": "string",
                  "description": "The toast message. Either this message or a widget must be provided."
                },
                "widget": {
                  "$ref": "#/$defs/Widget",
                  "description": "The custom widget to show as the Toast's body. Either this widget or a toast message must be provided."
                },
                "options": {
                  "type": "object",
                  "properties": {
                    "type": {
                      "type": "string",
                      "description": "Select a built-in toast style.",
                      "enum": [
                        "success",
                        "error",
                        "warning",
                        "info"
                      ]
                    },
                    "dismissible": {
                      "type": "boolean",
                      "description": "Whether to show a dismiss button (default is True)"
                    },
                    "position": {
                      "type": "string",
                      "enum": [
                        "top",
                        "topLeft",
                        "topRight",
                        "center",
                        "centerLeft",
                        "centerRight",
                        "bottom",
                        "bottomLeft",
                        "bottomRight"
                      ]
                    },
                    "duration": {
                      "type": "integer",
                      "description": "The number of seconds before the toast is dismissed",
                      "minimum": 1
                    }
                  }
                },
                "styles": {
                  "type": "object",
                  "allOf": [
                    {
                      "$ref": "#/$defs/backgroundColor",
                      "description": "Toast's background color"
                    },
                    {
                      "properties": {
                        "shadowColor": {
                          "oneOf": [
                            {
                              "title": "string",
                              "type": "string"
                            },
                            {
                              "title": "number",
                              "type": "number"
                            }
                          ],
                          "description": "box shadow color starting with '0xFF' for full opacity"
                        },
                        "shadowRadius": {
                          "type": "integer",
                          "minimum": 0
                        },
                        "shadowOffset": {
                          "type": "array",
                          "items": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    {
                      "$ref": "#/$defs/stylePadding"
                    },
                    {
                      "$ref": "#/$defs/borderRadius"
                    }
                  ]
                }
              }
            }
          }
        },
        {
          "title": "Execute Code",
          "oneOf": [
            {
              "type": "object",
              "required": ["executeCode"],
              "properties": {
                "executeCode": {
                  "description": "Execute a block of code.",
                  "type": "object",
                  "required": [
                    "body"
                  ],
                  "properties": {
                    "body": {
                      "type": "string",
                      "description": "Define your code block here, starting with //@code"
                    },
                    "onComplete": {
                      "$ref": "#/$defs/Action-payload",
                      "description": "Execute another Action when the code body finishes executing"
                    }
                  }
                }
              }
            },
            {
              "type": "string"
            }
          ]
        },
        {
          "title": "Get Location",
          "type": "object",
          "required": ["getLocation"],
          "properties": {
            "getLocation": {
              "type": "object",
              "description": "Requesting user's permission to get his/her current location",
              "properties": {
                "options": {
                  "type": "object",
                  "properties": {
                    "recurring": {
                      "type": "boolean",
                      "description": "Whether to continuously get the device location on this screen. Note that a screen can only have one recurring location listener. Adding multiple recurring location listeners will cancel the previous one."
                    },
                    "recurringDistanceFilter": {
                      "type": "integer",
                      "minimum": 50,
                      "description": "If recurring, the minimum distance (in meters) the device has moved before new location is returned. (default: 1000 meters, minimum: 50 meters)"
                    }
                  }
                },
                "onLocationReceived": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Callback Action once we get the device location"
                },
                "onError": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Callback Action if we are unable to get the device location. Reason is available under 'reason' field"
                }
              }
            }
          }
        },
        {
          "title": "Upload Files",
          "type": "object",
          "required": ["uploadFiles"],
          "properties": {
            "uploadFiles": {
              "type": "object",
              "description": "Allow users to upload files to an API from the camera or file system",
              "required": [
                "uploadApi",
                "files"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Give the uploadApi an ID, allows you to bind to its result. e.g. ${apiId.body...}"
                },
                "uploadApi": {
                  "type": "string",
                  "description": "Enter the name of your defined API"
                },
                "onComplete": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute another Action upon successful upload of files"
                },
                "onError": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when uploader fails with error(s)"
                },
                "inputs": {
                  "type": "array",
                  "description": "Define the list of input names that upload API accepts"
                },
                "fieldName": {
                  "type": "string",
                  "description": "Field name that your server is expecting (default files)"
                },
                "files": {
                  "type": "string",
                  "description": "Binded files from sources like camera or picker. e.g ${filePicker.files}, ${camerId.files}"
                },
                "options": {
                  "type": "object",
                  "maxFileSize": {
                    "type": "integer",
                    "description": "File size that is allowed (default 100 mb), If multiple is allow then sum of all files"
                  },
                  "overMaxFileSizeMessage": {
                    "type": "string",
                    "description": "Error message to show when selected files size is above maxFileSize."
                  },
                  "backgroundTask": {
                    "type": "boolean",
                    "description": "If set true, uploading will be done in background."
                  },
                  "showNotification": {
                    "type": "boolean",
                    "description": "If set true, progress will be show in notification bar."
                  },
                  "networkType": {
                    "type": "object",
                    "description": "An enumeration of network types.",
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": [
                          "connected",
                          "metered",
                          "not_required",
                          "not_roaming",
                          "unmetered",
                          "temporarily_unmetered"
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          "title": "Pick Files",
          "type": "object",
          "required": ["pickFiles"],
          "properties": {
            "pickFiles": {
              "type": "object",
              "description": "Pick files using system picker",
              "required": [
                "id"
              ],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Give the picker an ID allows you to bind to its result, which can be access anywhere e.g. ${filePicker.files...}"
                },
                "allowMultiple": {
                  "type": "boolean",
                  "description": "Allow users to pick multiple files (default False)"
                },
                "allowCompression": {
                  "type": "boolean",
                  "description": "It will allow media to apply the default OS compression (default True)"
                },
                "allowedExtensions": {
                  "type": "array",
                  "description": "Allow files with specific extension e.g jpg, png, pdf"
                }
              }
            }
          }
        },
        {
          "title": "Copy to Clipboard",
          "type": "object",
          "required": ["copyToClipboard"],
          "properties": {
            "copyToClipboard": {
              "type": "object",
              "description": "Copy the text to the clipboard",
              "properties": {
                "value": {
                  "type": "string",
                  "description": "The text to copy to clipboard"
                },
                "onSuccess": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute another Action upon successful copy to clipboard"
                },
                "onFailure": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when copy to clipboard fails"
                }
              }
            }
          }
        },
        {
          "title": "Connect Wallet",
          "type": "object",
          "required": ["connectWallet"],
          "properties": {
            "connectWallet": {
              "type": "object",
              "description": "Allow users connect to crypto wallet",
              "required": ["wcProjectId", "appMetaData"],
              "properties": {
                "id": {
                  "type": "string",
                  "description": "ID allows you to bind to its result. e.g. ${wallet.addresses...},"
                },
                "wcProjectId": {
                  "type": "string",
                  "description": "Wallet connect project Id, get it from wallet connect dashboard"
                },
                "onComplete": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute another Action upon successful upload of files"
                },
                "onError": {
                  "$ref": "#/$defs/Action-payload",
                  "description": "Execute an Action when uploader fails with error(s)"
                },
                "appMetaData": {
                  "type": "object",
                  "required": ["name"],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description" : "Your app name, that will be shared to crypto wallet"
                    },
                    "description": {
                      "type": "string",
                      "description" : "Your app's description, that will be shared to crypto wallet"
                    },
                    "url": {
                      "type": "string",
                      "description": "You app's / company's url"
                    },
                    "iconUrl" : {
                      "type": "string",
                      "description": "Url path of your app's icon"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    },
    "MenuBase": {
      "type": "object",
      "required": [
        "items"
      ],
      "properties": {
        "items": {
          "type": "array",
          "description": "List of menu items (minimum 2)",
          "items": {
            "type": "object",
            "required": [
              "icon",
              "label",
              "page"
            ],
            "properties": {
              "icon": {
                "type": "string",
                "description": "Icon name from Material Icons or Font Awesome"
              },
              "iconLibrary": {
                "type": "string",
                "enum": [
                  "default",
                  "fontAwesome"
                ]
              },
              "label": {
                "type": "string"
              },
              "page": {
                "type": "string",
                "description": "The new page to navigate to on click"
              },
              "selected": {
                "type": "boolean",
                "description": "Mark this item as selected. There should only be one selected item per page."
              }
            }
          }
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/backgroundColor"
            }
          ]
        }
      }
    },
    "MenuWithHeaderAndFooter": {
      "allOf": [
        {
          "$ref": "#/$defs/MenuBase"
        },
        {
          "properties": {
            "header": {
              "$ref": "#/$defs/Widget",
              "description": "The header widget for the menu"
            },
            "footer": {
              "$ref": "#/$defs/Widget",
              "description": "The footer widget for the menu"
            }
          }
        }
      ]
    },
    "MenuWithAdditionalStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/MenuWithHeaderAndFooter"
        },
        {
          "properties": {
            "styles": {
              "properties": {
                "borderColor": {
                  "$ref": "#/$defs/typeColors"
                },
                "borderWidth": {
                  "type": "integer"
                },
                "itemDisplay": {
                  "type": "string",
                  "description": "How to render each navigation item",
                  "enum": [
                    "stacked",
                    "sideBySide"
                  ]
                },
                "itemPadding": {
                  "oneOf": [
                    {
                      "title": "string",
                      "type": "string"
                    },
                    {
                      "title": "integer",
                      "type": "integer"
                    }
                  ],
                  "description": "Padding for each navigation item with CSS-style value"
                },
                "minWidth": {
                  "type": "integer",
                  "description": "The minimum width for the menu (default 200)"
                }
              }
            }
          }
        }
      ]
    },
    "Widgets": {
      "type": "array",
      "description": "List of widgets",
      "items": {
        "$ref": "#/$defs/Widget"
      }
    },
    "Widget": {
      "oneOf": [
        {
          "title": "Text",
          "required": ["Text"],
          "properties": {
            "Text": {
              "$ref": "#/$defs/Text-payload",
              "description": "Example from Kitchen Sink: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/c87f8b09-58e2-4c2f-99a1-cbbe9e25e9a5"
            }
          }
        },
        {
          "title": "Markdown",
          "required": ["Markdown"],
          "properties": {
            "Markdown": {
              "$ref": "#/$defs/Markdown-payload",
              "description": "Example from Kitchen Sink: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/6b6d9c3d-359b-4768-99a5-3f087a64387c#"
            }
          }
        },
        {
          "title": "Html",
          "required": ["Html"],
          "properties": {
            "Html": {
              "$ref": "#/$defs/Html-payload",
              "description": "Example from Kitchen Sink: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/ZhTBody9YozadVvTlhW0#"
            }
          }
        },
        {
          "title": "Icon",
          "required": ["Icon"],
          "properties": {
            "Icon": {
              "$ref": "#/$defs/Icon-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/e7c686f5-b8a2-4670-9e6e-8fdb0fea768e#"
            }
          }
        },
        {
          "title": "Image",
          "required": ["Image"],
          "properties": {
            "Image": {
              "$ref": "#/$defs/Image-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/7c7a3ffe-68ef-4e99-b9d1-4b5cee166233#"
            }
          }
        },
        {
          "title": "Lottie",
          "required": ["Lottie"],
          "properties": {
            "Lottie": {
              "$ref": "#/$defs/Lottie-payload"
            }
          }
        },
        {
          "title": "QRCode",
          "required": ["QRCode"],
          "properties": {
            "QRCode": {
              "$ref": "#/$defs/QRCode-payload"
            }
          }
        },
        {
          "title": "Progress",
          "required": ["Progress"],
          "properties": {
            "Progress": {
              "$ref": "#/$defs/Progress-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/c2c248f2-a289-40d3-acd5-65a1a7f3c5a2#"
            }
          }
        },
        {
          "title": "Divider",
          "required": ["Divider"],
          "properties": {
            "Divider": {
              "$ref": "#/$defs/Divider-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/4a893a2e-5bde-400c-b974-b25b497d31a5#"
            }
          }
        },
        {
          "title": "Spacer",
          "required": ["Spacer"],
          "properties": {
            "Spacer": {
              "$ref": "#/$defs/Spacer-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/1d7e42a9-5bbc-4b4b-9a02-8c102234ee05#"
            }
          }
        },
        {
          "title": "TextInput",
          "required": ["TextInput"],
          "properties": {
            "TextInput": {
              "$ref": "#/$defs/TextInput-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/abc081b1-bcb4-4db6-ae55-7987cb6c418e#"
            }
          }
        },
        {
          "title": "PasswordInput",
          "required": ["PasswordInput"],
          "properties": {
            "PasswordInput": {
              "$ref": "#/$defs/PasswordInput-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/218fa244-f0cd-4d17-91e6-7c099bbedede#"
            }
          }
        },
        {
          "title": "Checkbox",
          "required": ["Checkbox"],
          "properties": {
            "Checkbox": {
              "$ref": "#/$defs/OnOff-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/21f43d9b-db21-40fe-9c2f-806267e6c412#"
            }
          }
        },
        {
          "title": "Switch",
          "required": ["Switch"],
          "properties": {
            "Switch": {
              "$ref": "#/$defs/OnOff-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/3f4ba37a-0e6a-46a1-9b78-e4e04c84937d#"
            }
          }
        },
        {
          "title": "Dropdown",
          "required": ["Dropdown"],
          "properties": {
            "Dropdown": {
              "$ref": "#/$defs/SelectOne-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/fb8d28a2-834e-40a9-8419-155272fb0191#"
            }
          }
        },
        {
          "title": "Date",
          "required": ["Date"],
          "properties": {
            "Date": {
              "$ref": "#/$defs/Date-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/b45c5576-ec22-4b04-832f-6dd7571dd20f#"
            }
          }
        },
        {
          "title": "Time",
          "required": ["Time"],
          "properties": {
            "Time": {
              "$ref": "#/$defs/Time-payload",
              "description": "Kitchen Sink Example: ...coming ..."
            }
          }
        },
        {
          "title": "Button",
          "required": ["Button"],
          "properties": {
            "Button": {
              "$ref": "#/$defs/Button-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/09c1087b-f9ee-4a8c-9286-e0e881184c07#"
            }
          }
        },
        {
          "title": "Form",
          "required": ["Form"],
          "properties": {
            "Form": {
              "$ref": "#/$defs/Form-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/3107baf6-dfc3-42cd-b617-61c37b31f31e#"
            }
          }
        },
        {
          "title": "Flow",
          "required": ["Flow"],
          "properties": {
            "Flow": {
              "$ref": "#/$defs/Flow-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/3e901fb8-a0e8-4f52-979b-7f5f2547e650#"
            }
          }
        },
        {
          "title": "Column",
          "required": ["Column"],
          "properties": {
            "Column": {
              "$ref": "#/$defs/Column-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/90a8e4df-5eab-4473-ba10-2ecffc9596b0#"
            }
          }
        },
        {
          "title": "ListView",
          "required": ["ListView"],
          "properties": {
            "ListView": {
              "$ref": "#/$defs/ListView-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/w0Wmu9ZMP4csk7IELSx3#"
            }
          }
        },
        {
          "title": "Row",
          "required": ["Row"],
          "properties": {
            "Row": {
              "$ref": "#/$defs/Row-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/4bd0d453-c243-429d-a562-93cbc9db38e3#"
            }
          }
        },
        {
          "title": "FittedColumn",
          "required": ["FittedColumn"],
          "properties": {
            "FittedColumn": {
              "type": "object",
              "description": "Stretch to fit the parent (the parent is required to have a predetermined height), then distribute the vertical spaces evenly among its children. You can override the space distribution via 'childrenFits' attribute.",
              "$ref": "#/$defs/fittedBoxLayout"
            }
          }
        },
        {
          "title": "FittedRow",
          "required": ["FittedRow"],
          "properties": {
            "FittedRow": {
              "type": "object",
              "description": "Stretch to fit the parent (the parent is required to have a predetermined width), then distribute the horizontal spaces evenly among its children. You can override the space distribution via 'childrenFits' attribute.",
              "$ref": "#/$defs/fittedBoxLayout"
            }
          }
        },
        {
          "title": "GridView",
          "required": ["GridView"],
          "properties": {
            "GridView": {
              "$ref": "#/$defs/GridView-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/DX5j2WVQFabmxD9FCD5h#"
            }
          }
        },
        {
          "title": "Flex",
          "required": ["Flex"],
          "properties": {
            "Flex": {
              "$ref": "#/$defs/Flex-payload",
              "description": "Kitchen Sink Example: ...coming ..."
            }
          }
        },
        {
          "title": "Stack",
          "required": ["Stack"],
          "properties": {
            "Stack": {
              "$ref": "#/$defs/Stack-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/572ecf3b-b9f2-46f4-960f-ff438e5fa1dc#"
            }
          }
        },
        {
          "title": "Carousel",
          "required": ["Carousel"],
          "properties": {
            "Carousel": {
              "$ref": "#/$defs/Carousel-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/2e1d88b1-f281-4c2c-9bb1-bd18016d2b8c#"
            }
          }
        },
        {
          "title": "TabBar",
          "required": ["TabBar"],
          "properties": {
            "TabBar": {
              "$ref": "#/$defs/TabBar-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/cebd491d-7d90-43f4-9f17-b8575de441ca#"
            }
          }
        },
        {
          "title": "Map",
          "required": ["Map"],
          "properties": {
            "Map": {
              "$ref": "#/$defs/Map-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/36e52d1a-39c5-4a6b-b064-2be6cfe3cf7b#"
            }
          }
        },
        {
          "title": "Maps",
          "required": ["Maps"],
          "properties": {
            "Maps": {
              "$ref": "#/$defs/Maps-payload"
            }
          }
        },
        {
          "title": "Video",
          "required": ["Video"],
          "properties": {
            "Video": {
              "$ref": "#/$defs/Video-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/fce92bbb-af8e-403d-bf2d-c10926cc89a0#"
            }
          }
        },
        {
          "title": "WebView",
          "required": ["WebView"],
          "properties": {
            "WebView": {
              "$ref": "#/$defs/WebView-payload",
              "description": "Kitchen Sink Example: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/22c8d57d-a906-4d11-873d-161fd6c56c0a#"
            }
          }
        },
        {
          "title": "ChartJs",
          "required": ["ChartJs"],
          "properties": {
            "ChartJs": {
              "$ref": "#/$defs/ChartJs-payload",
              "description": "Example from Kitchen Sink: https://studio.ensembleui.com/app/e24402cb-75e2-404c-866c-29e6c3dd7992/screen/5d7b84de-3bbd-456e-aeea-98e2c9f4c3c7"
            }
          }
        },
        {
          "title": "Conditional",
          "required": ["Conditional"],
          "properties": {
            "Conditional": {
              "type": "object",
              "description": "Render widget based on condition.",
              "required": [ "conditions" ],
              "properties": {
                "conditions": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "if": {
                        "type": "string"
                      }
                    },
                    "required": [ "if" ]
                  }
                }
              }
            }
          }
        }
      ]
    },
    "Menu": {
      "type": "object",
      "description": "Specify the navigation menu for this page",
      "oneOf": [
        {
          "properties": {
            "BottomNavBar": {
              "description": "Use the bottom navigation bar",
              "$ref": "#/$defs/MenuBase"
            }
          }
        },
        {
          "properties": {
            "Drawer": {
              "description": "Put the menu behind a drawer icon on the header. The drawer icon will be positioned to the 'start' of the header (left for most languages, right for RTL languages).",
              "$ref": "#/$defs/MenuWithHeaderAndFooter"
            }
          }
        },
        {
          "properties": {
            "EndDrawer": {
              "description": "Put the menu behind a drawer icon on the header. The drawer icon will be positioned to the 'end' of the header (right for most languages, left for RTL languages).",
              "$ref": "#/$defs/MenuWithHeaderAndFooter"
            }
          }
        },
        {
          "properties": {
            "Sidebar": {
              "description": "Enable a fixed navigation menu to the 'start' of the screen (left for most languages, right for RTL languages). The menu may become a drawer menu on lower resolution.",
              "$ref": "#/$defs/MenuWithAdditionalStyles"
            }
          }
        },
        {
          "properties": {
            "EndSidebar": {
              "description": "Enable a fixed navigation menu to the 'end' of the screen (right for most languages, left for RTL languages). The menu may become a drawer menu on lower resolution.",
              "$ref": "#/$defs/MenuWithAdditionalStyles"
            }
          }
        }
      ]
    },
    "TabBar-payload": {
      "type": "object",
      "properties": {
        "styles": {
          "allOf": [
            {
              "type": "object",
              "properties": {
                "tabPosition": {
                  "type": "string",
                  "description": "How to lay out the Tab labels",
                  "oneOf": [
                    {
                      "const": "start",
                      "description": "Align the labels to the start of the container and scroll if necessary"
                    },
                    {
                      "const": "stretch",
                      "description": "Distribute the labels evenly across available container width. Labels will be cut off instead of scrolling"
                    }
                  ]
                },
                "tabPadding": {
                  "oneOf": [
                    {
                      "title": "string",
                      "type": "string"
                    },
                    {
                      "title": "integer",
                      "type": "integer"
                    }
                  ],
                  "description": "Padding for each tab labels with CSS-style value. Default: 0 30 0 0 (right padding only)"
                },
                "tabFontSize": {
                  "type": "integer",
                  "description": "Font size for the tab text"
                },
                "tabFontWeight": {
                  "$ref": "#/$defs/type-fontWeight",
                  "description": "Font weight for the tab text"
                },
                "tabBackgroundColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The background color of the tab's navigation bar"
                },
                "activeTabColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The color of the selected tab's text"
                },
                "inactiveTabColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The color of the un-selected tabs' text"
                },
                "indicatorColor": {
                  "$ref": "#/$defs/typeColors",
                  "description": "The color of the selected tab's indicator"
                },
                "indicatorThickness": {
                  "type": "integer",
                  "description": "The thickness of the selected tab's indicator"
                }
              }
            },
            {
              "$ref": "#/$defs/styleMargin"
            }
          ]
        },
        "selectedIndex": {
          "type": "integer",
          "minimum": 0,
          "description": "Selecting a Tab based on its index order"
        },
        "items": {
          "type": "array",
          "description": "Define each of your Tab here",
          "items": {
            "type": "object",
            "required": [
              "label",
              "widget"
            ],
            "properties": {
              "label": {
                "type": "string",
                "description": "Setting the tab label"
              },
              "icon": {
                "$ref": "#/$defs/HasIcon"
              },
              "widget": {
                "$ref": "#/$defs/Widget",
                "description": "Return an inline widget or specify a custom widget to be rendered as this tab's content"
              }
            }
          }
        }
      }
    },
    "Maps-payload": {
      "type": "object",
      "properties": {
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "type": "object",
              "properties": {
                "width": {
                  "type": "integer"
                },
                "height": {
                  "type": "integer"
                },
                "autoZoom": {
                  "type": "boolean",
                  "description": "Automatically zoom the maps to show all the markers (and optionally the current location). Default True."
                },
                "autoZoomPadding": {
                  "type": "integer"
                },
                "locationEnabled": {
                  "type": "boolean"
                },
                "includeCurrentLocationInAutoZoom": {
                  "type": "boolean"
                },
                "mapType": {
                  "type": "string",
                  "enum": [
                    "normal",
                    "satellite",
                    "terrain",
                    "hybrid"
                  ]
                },
                "initialCameraPosition": {
                  "type": "object",
                  "properties": {
                    "lat": {
                      "type": "number"
                    },
                    "lng": {
                      "type": "number"
                    },
                    "zoom": {
                      "type": "integer",
                      "minimum": 0
                    }
                  }
                },
                "markerOverlayMaxWidth": {
                  "type": "integer",
                  "description": "Marker overlay stretches to fill available horizontal space. Use this to cap its width on larger screens. (default 500)"
                },
                "markerOverlayMaxHeight": {
                  "type": "integer",
                  "description": "Set the max height of the marker overlay. (default: 50% of the screen height)"
                },
                "scrollableMarkerOverlay": {
                  "type": "boolean",
                  "description": "If using overlay and there are more than one marker, swiping left/right within the overlay will navigate to next/previous marker"
                },
                "autoSelect": {
                  "type": "boolean",
                  "description": "Automatically select a marker (if not already) when the markers are updated."
                }

              }
            }
          ]
        },
        "onCameraMove": {
          "$ref": "#/$defs/Action-payload",
          "description": "Execute an Action when the map's bound has changed. The bound data is available using `event.data.bounds.<southwest/northeast>.<lat/lng>`."
        },
        "onMapCreated": {
          "$ref": "#/$defs/Action-payload",
          "description": "Execute an Action when the map's initial state has been rendered. Note that this may not mean the location and markers (if any) are available yet."
        },
        "markers": {
          "type": "object",
          "required": [
            "data",
            "name",
            "location"
          ],
          "properties": {
            "data": {
              "type": "string",
              "description": "Bind the marker list to the data e.g. myAPI.body.items"
            },
            "name": {
              "type": "string",
              "description": "Give this a name. This is the bindable data for each marker."
            },
            "location": {
              "type": "object",
              "required": ["lat", "lng"],
              "properties": {
                "lat": {
                  "type": "number",
                  "description": "The latitude of the marker"
                },
                "lng": {
                  "type": "number",
                  "description": "The longitude of the marker"
                }
              }
            },
            "marker": {
              "type": "object",
              "properties": {
                "source": {
                  "type": "string",
                  "description": "The marker's image asset. This can come from URL or from local asset."
                }
              }
            },
            "selectedMarker": {
              "type": "object",
              "properties": {
                "source": {
                  "type": "string",
                  "description": "The marker's image asset when selected. This can come from URL or from local asset."
                }
              }
            },
            "overlayWidget": {
              "$ref": "#/$defs/Widget",
              "description": "The widget to render as an overlay over the maps. Use this to convey more detail info for each marker."
            },
            "onMarkerTap": {
              "$ref": "#/$defs/Action-payload",
              "description": "Execute an Action when tapping on the marker"
            },
            "onMarkersUpdated": {
              "$ref": "#/$defs/Action-payload",
              "description": "Execute an Action when the markers have been updated and rendered."
            }
          }
        }
      }
    },
    "Map-payload": {
      "type": "object",
      "properties": {
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "type": "object",
              "properties": {
                "markerWidth": {
                  "type": "integer",
                  "description": "The width of each marker. (default 60)"
                },
                "markerHeight": {
                  "type": "integer",
                  "description": "The height of each marker. (default 30)"
                }
              }
            }
          ]
        },
        "currentLocation": {
          "type": "object",
          "properties": {
            "enabled": {
              "type": "boolean",
              "description": "If enabled, this will prompt the user for location access. User location will then be shown on the map"
            },
            "widget": {
              "$ref": "#/$defs/Widget",
              "description": "The widget to render the user's location"
            }
          }
        },
        "markers": {
          "type": "object",
          "required": [
            "data",
            "name",
            "location",
            "widget"
          ],
          "properties": {
            "data": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "location": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number",
                  "description": "The latitude of the marker"
                },
                "lng": {
                  "type": "number",
                  "description": "The longitude of the marker"
                }
              }
            },
            "widget": {
              "$ref": "#/$defs/Widget",
              "description": "The widget to render each marker"
            },
            "selectedWidget": {
              "$ref": "#/$defs/Widget",
              "description": "The widget to render a selected marker"
            },
            "selectedWidgetOverlay": {
              "$ref": "#/$defs/Widget",
              "description": "The widget to render as an overlay at the bottom of the map. Use this to convey more detail info."
            }
          }
        }
      }
    },
    "Video-payload": {
      "type": "object",
      "properties": {
        "source": {
          "type": "string",
          "description": "The URL source to the media file"
        }
      }
    },
    "WebView-payload": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "properties": {
                "width": {
                  "type": "integer",
                  "description": "By default the width will match its parent's available width, but you can set an explicit width here."
                },
                "height": {
                  "type": "integer",
                  "description": "If no height is specified, the web view will stretch its height to fit its content, in which case a scrollable parent is required to scroll the content. You may override this behavior by explicitly set the web view's height here, or uses 'expanded' to fill the available height."
                }
              }
            }
          ]
        }
      }
    },
    "ChartJs-payload": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "description": "ID to be referenced later"
        },
        "styles": {
          "type": "object",
          "properties": {
            "width": {
              "type": "integer",
              "minimum": 0
            },
            "height": {
              "type": "integer",
              "minimum": 0
            }
          }
        },
        "config": {
          "type": "string",
          "description": "Chartjs config. \nSee this for an example - https://www.chartjs.org/docs/latest/configuration/"
        }
      }
    },
    "baseStyles": {
      "type": "object",
      "properties": {
        "expanded": {
          "type": "boolean",
          "description": "If the parent is a Row or Column, this flag will stretch this widget in the appropriate direction. (e.g stretch horizontally for parent of type Row)"
        }
      }
    },
    "stylePadding": {
      "type": "object",
      "properties": {
        "padding": {
          "oneOf": [
            {
              "title": "string",
              "type": "string"
            },
            {
              "title": "integer",
              "type": "integer"
            }
          ],
          "description": "Padding with CSS-style value e.g. padding: 5 20 5"
        }
      }
    },
    "styleMargin": {
      "type": "object",
      "properties": {
        "margin": {
          "oneOf": [
            {
              "title": "string",
              "type": "string"
            },
            {
              "title": "integer",
              "type": "integer"
            }
          ],
          "description": "Margin with CSS-style notation e.g. margin: 5 20 5"
        }
      }
    },
    "borderRadius": {
      "type": "object",
      "properties": {
        "borderRadius": {
          "oneOf": [
            {
              "title": "string",
              "type": "string"
            },
            {
              "title": "integer",
              "type": "integer"
            }
          ],
          "minimum": 0,
          "description": "Border Radius with CSS-like notation (1 to 4 integers)"
        }
      }
    },
    "typeColors": {
      "oneOf": [
        {
          "title": "number",
          "type": "integer"
        },
        {
          "title": "name",
          "type": "string",
          "enum": [
            "transparent",
            "black",
            "blue",
            "white",
            "red",
            "grey",
            "teal",
            "amber",
            "pink",
            "purple",
            "yellow",
            "green",
            "brown",
            "cyan",
            "indigo",
            "lime",
            "orange"
          ]
        },
        {
          "title": "hexadecimal",
          "type": "string",
          "pattern": "^0x"
        }
      ]
    },
    "type-fontWeight": {
      "type": "string",
      "enum": [
        "light",
        "normal",
        "bold",
        "w100",
        "w200",
        "w300",
        "w400",
        "w500",
        "w600",
        "w700",
        "w800",
        "w900"
      ]
    },
    "boxStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/boxStylesWithoutDimension"
        },
        {
          "$ref": "#/$defs/HasDimension"
        }
      ]
    },
    "boxStylesWithoutDimension": {
      "allOf": [
        {
          "$ref": "#/$defs/styleMargin"
        },
        {
          "$ref": "#/$defs/stylePadding"
        },
        {
          "$ref": "#/$defs/HasBackground"
        },
        {
          "$ref": "#/$defs/HasBorder"
        },
        {
          "$ref": "#/$defs/HasShadow"
        }
      ]
    },
    "boxLayoutStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/boxStyles"
        },
        {
          "type": "object",
          "properties": {
            "gap": {
              "type": "integer",
              "minimum": 0
            },
            "fontFamily": {
              "type": "string",
              "description": "Set the font family applicable for all widgets inside this container"
            },
            "fontSize": {
              "type": "integer",
              "minimum": 0
            }
          }
        }
      ]
    },
    "fittedBoxLayout": {
      "required": ["children"],
      "properties": {
        "children": {
          "$ref": "#/$defs/Widgets"
        },
        "styles": {
          "allOf": [
            {
              "$ref": "#/$defs/baseStyles"
            },
            {
              "$ref": "#/$defs/boxLayoutStyles"
            },
            {
              "properties": {
                "mainAxis": {
                  "type": "string",
                  "description": "Control our children's layout horizontally",
                  "enum": [
                    "start",
                    "center",
                    "end",
                    "spaceBetween",
                    "spaceAround",
                    "spaceEvenly"
                  ]
                },
                "crossAxis": {
                  "type": "string",
                  "description": "Control the vertical alignment of the children",
                  "enum": [
                    "start",
                    "center",
                    "end",
                    "stretch",
                    "baseline"
                  ]
                },
                "childrenFits": {
                  "type": "array",
                  "description": "Specify an array of non-zero integers or 'auto', each corresponding to a child. Setting 'auto' will let the child determines its own size, while setting a non-zero integer will determine the child's size multiple. The 'auto' children will be laid out first and get as much space as they need, then the left-over space will be distributed to the other children based on their size multiples.",
                  "items": {
                    "oneOf": [
                      {
                        "const": "auto",
                        "description": "Allow this selected child to determine its own size. This may give an error if the child doesn't have a dimension."
                      },
                      {
                        "type": "integer",
                        "description": "Default 1. After laying out the 'auto' children, the left-over space will be divided up based on this multiple.",
                        "minimum": 1
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    },
    "flowStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/baseStyles"
        },
        {
          "type": "object",
          "properties": {
            "mainAxis": {
              "type": "string",
              "description": "Control our children's layout vertically",
              "enum": [
                "start",
                "center",
                "end",
                "spaceBetween",
                "spaceAround",
                "spaceEvenly"
              ]
            },
            "gap": {
              "type": "integer",
              "description": "The gap between the children in the main direction",
              "minimum": 0
            },
            "lineGap": {
              "type": "integer",
              "description": "The gap between the lines if the children start wrapping",
              "minimum": 0
            },
            "maxWidth": {
              "type": "integer",
              "minimum": 0
            },
            "maxHeight": {
              "type": "integer",
              "minimum": 0
            }
          }
        }
      ]
    },
    "columnStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/baseStyles"
        },
        {
          "$ref": "#/$defs/boxLayoutStyles"
        },
        {
          "type": "object",
          "properties": {
            "mainAxis": {
              "type": "string",
              "description": "Control our children's layout vertically",
              "enum": [
                "start",
                "center",
                "end",
                "spaceBetween",
                "spaceAround",
                "spaceEvenly"
              ]
            },
            "crossAxis": {
              "type": "string",
              "description": "Control the horizontal alignment of the children",
              "enum": [
                "start",
                "center",
                "end",
                "stretch",
                "baseline"
              ]
            },
            "mainAxisSize": {
              "type": "string",
              "description": "If 'max', stretch the Column to fill its parent's height. Otherwise (min) the column's height will be its children's combined.",
              "enum": [
                "min",
                "max"
              ]
            },
            "scrollable": {
              "type": "boolean",
              "description": "Set to true so content can scroll vertically as needed"
            },
            "autoFit": {
              "type": "boolean",
              "description": "Explicitly make the column's width as wide as the largest child, but only if our column's parent does not already assign a width. This attribute is useful for sizing children who don't have a width (e.g Divider)"
            }
          }
        }
      ]
    },
    "rowStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/baseStyles"
        },
        {
          "$ref": "#/$defs/boxLayoutStyles"
        },
        {
          "type": "object",
          "properties": {
            "mainAxis": {
              "type": "string",
              "description": "Control our children's layout horizontally",
              "enum": [
                "start",
                "center",
                "end",
                "spaceBetween",
                "spaceAround",
                "spaceEvenly"
              ]
            },
            "crossAxis": {
              "type": "string",
              "description": "Control the vertical alignment of the children",
              "enum": [
                "start",
                "center",
                "end",
                "stretch",
                "baseline"
              ]
            },
            "mainAxisSize": {
              "type": "string",
              "description": "If 'max', stretch the Row to fill its parent's width. Otherwise (min) the Row's width will be its children's combined.",
              "enum": [
                "min",
                "max"
              ]
            },
            "scrollable": {
              "type": "boolean",
              "description": "Set to true so content can scroll horizontally as needed"
            },
            "autoFit": {
              "type": "boolean",
              "description": "Explicitly make the row's height as tall as the largest child, but only if the row's parent does not already assign us a height. This attribute is useful for sizing children who don't have a width (e.g vertical Divider)"
            }
          }
        }
      ]
    },
    "flexStyles": {
      "allOf": [
        {
          "$ref": "#/$defs/baseStyles"
        },
        {
          "$ref": "#/$defs/boxLayoutStyles"
        },
        {
          "type": "object",
          "required": [
            "direction"
          ],
          "properties": {
            "direction": {
              "type": "string",
              "description": "Lay out the children vertically or horizontally",
              "enum": [
                "vertical",
                "horizontal"
              ]
            },
            "mainAxis": {
              "type": "string",
              "description": "Control how to lay out the children, in the direction specified by the 'direction' attribute",
              "enum": [
                "start",
                "center",
                "end",
                "spaceBetween",
                "spaceAround",
                "spaceEvenly"
              ]
            },
            "crossAxis": {
              "type": "string",
              "description": "Control the alignment of the children on the secondary axis (depending on the 'direction' attribute)",
              "enum": [
                "start",
                "center",
                "end",
                "stretch",
                "baseline"
              ]
            },
            "mainAxisSize": {
              "type": "string",
              "description": "If 'max', stretch the Flex to fill its parent's dimension (width or height based on the direction). Otherwise (min) the Flex's dimension will be its children's combined.",
              "enum": [
                "min",
                "max"
              ]
            },
            "scrollable": {
              "type": "boolean",
              "description": "Set to true so content can scroll vertically or horizontally as needed"
            },
            "autoFit": {
              "type": "boolean",
              "description": "Explicitly match the width or height to the largest child's size, but only if the parent does not already assign a width or height. This attribute is useful for sizing children who don't have a width or height (e.g Divider)"
            }
          }
        }
      ]
    },
    "backgroundColor": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "$ref": "#/$defs/typeColors",
          "description": "Background color, starting with '0xFF' for full opacity e.g 0xFFCCCCCC"
        }
      }
    },
    "backgroundGradient": {
      "type": "object",
      "properties": {
        "backgroundGradient": {
          "type": "object",
          "properties": {
            "colors": {
              "type": "array",
              "description": "The list of colors used for the gradient",
              "items": {
                "$ref": "#/$defs/typeColors"
              }
            },
            "start": {
              "description": "The starting position of the gradient",
              "$ref": "#/$defs/alignment"
            },
            "end": {
              "description": "The ending position of the gradient",
              "$ref": "#/$defs/alignment"
            }
          }
        }
      }
    },
    "backgroundImage": {
      "type": "object",
      "properties": {
        "backgroundImage": {
          "type": "object",
          "properties": {
            "source": {
              "type": "string",
              "description": "The Image URL to fill the background"
            },
            "fit": {
              "type": "string",
              "description": "How to fit the image within our width/height or our parent (if dimension is not specified)",
              "oneOf": [
                {
                  "const": "fill",
                  "description": "Stretch our image to fill the dimension, and distorting the aspect ratio if needed"
                },
                {
                  "const": "contain",
                  "description": "Scale the image such that the entire image is contained within our dimension"
                },
                {
                  "const": "cover",
                  "description": "Scale the image to fill our dimension, clipping the image as needed"
                },
                {
                  "const": "fitWidth",
                  "description": "Scale the image to fit the width, and clipping the height if needed"
                },
                {
                  "const": "fitHeight",
                  "description": "Scale the image to fit the height, and clipping the width if needed"
                },
                {
                  "const": "none",
                  "description": "Center-Align the original image size, clipping the content if needed"
                },
                {
                  "const": "scaleDown",
                  "description": "Center-Align the image and only scale down to fit. Image will not be scaled up to bigger dimension."
                }
              ]
            },
            "alignment": {
              "$ref": "#/$defs/alignment"
            }
          }
        }
      }
    },
    "alignment": {
      "type": "string",
      "enum": [
        "topLeft",
        "topCenter",
        "topRight",
        "centerLeft",
        "center",
        "centerRight",
        "bottomLeft",
        "bottomCenter",
        "bottomRight"
      ]
    },
    "inputValidator": {
      "type": "object",
      "properties": {
        "validator": {
          "type": "object",
          "properties": {
            "minLength": {
              "type": "integer",
              "description": "The minimum number of characters",
              "minimum": 0
            },
            "maxLength": {
              "type": "integer",
              "description": "The maximum number of characters",
              "minimum": 0
            },
            "regex": {
              "type": "string",
              "description": "The Regular Expression the input will need to match"
            },
            "regexError": {
              "type": "string",
              "description": "The customized error message to show when the input does not match the provided regex."
            }
          }
        }
      }
    },
    "TextStyle": {
      "type": "object",
      "properties": {
        "fontSize": {
          "type": "integer"
        },
        "color": {
          "$ref": "#/$defs/typeColors"
        },
        "decoration": {
          "type": "string",
          "enum": [
            "none",
            "lineThrough",
            "underline",
            "overline"
          ]
        }
      }
    },
    "HasDimension": {
      "type": "object",
      "properties": {
        "width": {
          "type": "integer",
          "minimum": 0
        },
        "height": {
          "type": "integer",
          "minimum": 0
        }
      }
    },
    "HasBorder": {
      "allOf": [
        {
          "$ref": "#/$defs/borderRadius"
        },
        {
          "type": "object",
          "properties": {
            "borderColor": {
              "$ref": "#/$defs/typeColors",
              "description": "Border color, starting with '0xFF' for full opacity"
            },
            "borderWidth": {
              "type": "integer",
              "minimum": 0,
              "description": "The thickness of the border"
            }
          }
        }
      ]
    },
    "HasShadow": {
      "type": "object",
      "properties": {
        "shadowColor": {
          "oneOf": [
            {
              "title": "string",
              "type": "string"
            },
            {
              "title": "number",
              "type": "number"
            }
          ],
          "description": "Box shadow color starting with '0xFF' for full opacity"
        },
        "shadowOffset": {
          "type": "array",
          "items": {
            "type": "integer"
          }
        },
        "shadowRadius": {
          "type": "integer",
          "minimum": 0
        },
        "shadowStyle": {
          "type": "string",
          "description": "The blur style to apply on the shadow",
          "oneOf": [
            {
              "const": "normal",
              "description": "Fuzzy inside and outside (default)."
            },
            {
              "const": "solid",
              "description": "Solid inside, fuzzy outside."
            },
            {
              "const": "outer",
              "description": "Nothing inside, fuzzy outside."
            },
            {
              "const": "inner",
              "description": "Fuzzy inside, nothing outside."
            }
          ]
        }
      }
    },
    "HasBackground": {
      "allOf": [
        {
          "$ref": "#/$defs/backgroundColor"
        },
        {
          "$ref": "#/$defs/backgroundImage"
        },
        {
          "$ref": "#/$defs/backgroundGradient"
        }
      ]
    },
    "HasIcon": {
      "type": "object",
      "description": "Specifies the icon to use. You can also use the short-handed syntax 'iconName iconLibrary')",
      "properties": {
        "name": {
          "oneOf": [
            {
              "title": "string",
              "type": "string"
            },
            {
              "title": "integer",
              "type": "integer"
            }
          ],
          "description": "The name of the icon"
        },
        "library": {
          "type": "string",
          "description": "Which icon library to use.",
          "enum": [
            "default",
            "fontAwesome"
          ]
        },
        "color": {
          "$ref": "#/$defs/typeColors"
        },
        "size": {
          "type": "integer",
          "minimum": 0
        }
      }
    }
  }
};


const EnsemblewidgetProps = (props)  => {

  const { title, details } = props;

  return (
    <>
      <br />
      | {title} | {details.type} | {details.description}  { typeof details.enum === 'object' && <> {details.enum.map((e) => {return <span>`{e}` </span>})} </> } |
      { details.type === 'object' && details.properties &&
        <div>
          <br/>
          ##### {title}
          <br/>
          | Property          | Type     | Description |
          <br/>
          | :---------------- | :------- | :------- | :------- |
          { Object.entries(details.properties).map(([key, value]) => {
            if (value && typeof value === 'object')
              return (
                <>
                  <EnsemblewidgetProps
                    key={key}
                    title={key}
                    details={value} />
                </>
              )
            })}
          <br/>
        </div>
        
      }
    </>
  );
}

function App() {
  const [widget, setWidget] = useState("Form");
  const [markdown, setMarkdown] = useState("...");
  const [widgetPayload, setwidgetPayload] = useState(null);
  const [objectProps, setObjectProps] = useState([]);
  const [levelOneDone, setLevelOneDone] = useState(false);

  const mergeAllOf = (widgetSchema) => {
    let mergedProps = {};
    widgetSchema.allOf.map(subProps => {
      mergedProps = {...mergedProps, ...subProps.properties};
    });

    console.log(mergedProps);
    return(mergedProps);

  }

  const handleInputChange = (event) => {
    setWidget(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // reset
    setwidgetPayload(null);
    setObjectProps([]);
    setLevelOneDone(false);

    $RefParser.dereference(mySchema, (err, schema) => {
      if (err)
        console.error(err);
      else {
        let widgetSchema = {};
        widgetSchema = schema.$defs[widget+'-payload'];

        if (widget && 'allOf' in widgetSchema)
          setwidgetPayload(mergeAllOf(widgetSchema));
        else if (widget && 'additionalProperties' in widgetSchema)
          setwidgetPayload(widgetSchema.additionalProperties.properties);
        else if (widget)
          setwidgetPayload(widgetSchema.properties);
      }
    });
  }


  const getMarkdownRow = (key, value) => {
    if(value && value.type == "object")
      return (`\n| ${key} | ${value.type} | [See properties](#${key}) |`);
    else if (value)
      return (`\n| ${key} | ${value.type} | ${value.description}  |`);
  }


  useEffect(() => {

    let m = `\n## API reference  \n\n| Property | Type | Description |  \n\n| :---------------- | :------- | :------- |`;


    if (widgetPayload) {
      console.log("widgetPayload");
      console.log(widgetPayload);
      Object.entries(widgetPayload).map(([key, value]) => {
        
        
        if ("allOf" in value) {
          let mergedProps = {};
          value.allOf.map((subProps) => {
            mergedProps = { ...mergedProps, ...subProps.properties };
          });
          value["type"] = "object";
          value["properties"] = mergedProps;
        }

        m = m + getMarkdownRow(key, value);

        if (value.type == "object")
          setObjectProps(objectProps.concat([{[key]: value}]));
      });

      setMarkdown(m);
      setLevelOneDone(true);
    }
  },[widgetPayload]);




  useEffect(() => {

    if (objectProps.length > 0  && levelOneDone) {
      let childMarkdown;

      objectProps.map((childObject) => {


      Object.entries(childObject).map(([oKey, oValue]) => {
          
          console.log("childObject");
          console.log(oValue);

          childMarkdown = `\n\n ### ${oKey} \n\n| Property | Type | Description |\n| :---------------- | :------- | :------- |`;
  
          Object.entries(oValue.properties).map(([key, value]) => {
            childMarkdown = childMarkdown + getMarkdownRow(key, value);
            // if (value.type == "object")
            //   setObjectProps(objectProps.concat([{[key]: value}]));
          });

          
        });
        
        setMarkdown(markdown + childMarkdown);
      });
    }
  },[levelOneDone]);


  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" name="widget" value={widget} onChange={handleInputChange} />
        <input type="submit" value="Submit" />
      </form>
      <textarea rows={50} cols={200} value={markdown} />
    </div>
  );
}

export default App;
