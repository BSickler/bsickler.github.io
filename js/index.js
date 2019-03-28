Port = {
    Menu: {
        // Label and class for each icon
        Btns: {
            Code: "fas fa-code fa-2x",
            Writing: "fas fa-pencil-alt fa-2x",
            Misc: "fas fa-asterisk fa-2x",
        },

        // Pre element population method
        Init: function() {

            // Set main element of the Port Nav bar
            Port.Elem = document.getElementById("port-nav");

            // Set main element of Content Nav bar
            Content.Util.Init();

            this.Build();
        },

        // Element population method
        Build: function() {
            let btns = this.Btns;

            // For each key pair in Port.Menu.Btns generate a btn element
            // and append it to the port-nav element
            Object.keys(btns).map((key) => {

                let container = document.createElement('div');
                container.className ="icon-container";
                container.id = key+"-Btn";
                
                // Initiate the Btn element
                Content[key].Menu.Init(container);

                // Add onclick function for Btn element
                container.onclick = function(){Content[key].Menu.Build(container);};

                let icon = document.createElement("i");
                icon.className = btns[key];

                let lbl = document.createElement("span");
                lbl.id = key+"-lbl";
                lbl.innerText = key;

                container.appendChild(icon);
                container.appendChild(lbl);

                Port.Elem.appendChild(container);

            })
        }
    },

    Util: {
        // Moves the active button to top of the content window
        Activate: function(elem) {

            let first = Port.Elem.firstChild;

            // Checks if btn is already at top
            if(elem !== first) {

                // Removes active button
                Port.Elem.removeChild(elem);

                // Adds active button as first child
                Port.Elem.insertBefore(elem, first);
            }
        },
    }
}

Content = {

    // Methods controlling content
    Util: {
        // Sets main element for content nav bar
        Init: function() {
            Content.Elem = document.getElementById('cont-nav');

            Content.Util.Window.Init();
        },

        // Displays the content nav bar and builds icons
        Activate: function(btns) {
            Content.Elem.style.display = "flex";

            Object.keys(btns).map((key) => {
                
                // Create icon container
                let container = document.createElement('div');
                container.className ="icon-container";
                container.id = key+"-Btn";
                container.key = key;
                
                // Changes the content header to the Lbl of whichever
                // app btn is moused over
                function hover() {
                    let elem = document.getElementById('port-header');
                    elem.innerHTML = (btns[key].Lbl ? btns[key].Lbl : key);

                };

                // On click displays the content window and associated content
                function clickOpen() {
                    // If button clicked is different from current display
                    // remove displayed content and build new content
                    if(Content.Util.Window.Status !== key) {
                        Content.Util.Window.Close();
                        Content.Util.Window.Build(btns[key]);
                        Content.Util.Window.Status = key;
                    
                    // If content displayed equals currently displayed content
                    // removes all content
                    } else {
                        Content.Util.Window.Close();
                        Content.Util.Window.Status = null;
                    }
                };

                // Add hover & click event listeners
                container.addEventListener("mouseenter", hover);
                container.onclick = clickOpen;

                let icoType = btns[key].Icon.Type;
                let icoSrc = btns[key].Icon.Src;

                // Determine icon type
                if( icoType === "img") {
                    // Changes container background to img
                    container.style.backgroundImage = "url("+icoSrc+")";
                    
                
                } else if ( icoType === "icon") {

                    // Creates an icon and appends to the container
                    let ico = document.createElement('i');
                    ico.className = icoSrc;

                    container.appendChild(ico);
                } else {
                    console.log("Content type cannot be determined")
                };


                // Append the container to the Cont-nav element
                Content.Elem.appendChild(container);
            });
        },

        // Hides the content nav bar and clears it
        Deactivate: function() {
            Content.Elem.style.display = "none";

            // Removes any buttons present
            while(Content.Elem.hasChildNodes()) {
                Content.Elem.removeChild(Content.Elem.lastChild)
            };
        },

        // Closes all open content windows
        Close: function() {
            
            Object.keys(Content).map((key) => {

                if(key !== "Util" && key !== "Elem") {

                    Content[key].Menu.Close();

                } else {

                    return null;
                }
            })
        },

        // Controls content window
        Window: {
            Init: function() {
                this.Elem = document.getElementById('cont-window');
            },

            Build: function(cont) {

                // slideshow generates a slideshow player element and
                // a content description window
                if(cont.Type === "slideshow") {

                    let show = document.createElement("section");
                    show.id = "slideshow";
                    show.style.backgroundImage = "url('imgs/"+cont.Src[0]+"')";

                    this.Elem.appendChild(show);

                    // Build and append the content description window
                    this.Elem.appendChild(buildDescrip(cont.Description));

                // webApp type generates an iframe or img+link for the app and
                // a content description window
                } else if (cont.Type === "webApp") {
                    // Check if img link is needed
                    if (cont.Img) {
                        let img = document.createElement("img");
                        img.src = cont.Img;
                        img.className = "app-link";

                        img.onclick = function() {
                            window.open(cont.Src, "","menubar=no,scrollbars=no" )
                        };

                        this.Elem.appendChild(img);

                    // If no img key is present then generate an iframe
                    } else {
                        let iframe = document.createElement("iframe");
                        iframe.src = cont.Src;
                        iframe.id = "content-App";
                        iframe.style.backgroundColor = "white";

                        this.Elem.appendChild(iframe);
                    }
                    

                    // Build and append the content description window
                    this.Elem.appendChild(buildDescrip(cont.Description));

                // document type displays pdf of the file
                } else if (cont.Type === "document") {
                    let doc = document.createElement('embed');
                    doc.id = "content-Doc";
                    doc.src = cont.Src;

                    this.Elem.appendChild(doc);

                    // Build and append the content description window
                    this.Elem.appendChild(buildDescrip(cont.Description));
                }

                // Display the content window
                this.Elem.style.display = "flex";

                // Function to build content description window
                function buildDescrip(descrip) {

                    // Create new element
                    this.Descrip = document.createElement("section");
                    this.Descrip.id = "content-description";

                    // Iterate through description content

                    // Check if text elements present
                    if(descrip.Text) {
                        let i = 0;
                        descrip.Text.forEach( text => {
                            let p = document.createElement('p');
                            p.className = "descrip-Paragraph";
                            p.id = "descrip-Paragraph-"+i;
                            p.innerHTML = text;

                            i++;

                            this.Descrip.appendChild(p);
                        });
                    };

                    if(descrip.Bullets) {
                        // Create ul element
                        let list = document.createElement('ul');
                        list.id = "descrip-Bullets"

                        let j = 0;
                        descrip.Bullets.forEach( (text) => {
                            let bullet = document.createElement('li');
                            bullet.id = "descrip-Bullet-"+j;
                            bullet.innerText = text;

                            j++;
                            
                            list.appendChild(bullet);
                        });

                        this.Descrip.appendChild(list);
                    };

                    return(this.Descrip);
                };
            },

            Close: function() {
                this.Elem.style.display = "none";

                while(this.Elem.hasChildNodes()) {
                    this.Elem.removeChild(this.Elem.lastChild)
                };
            },
        },
    },

    Code: {
        Menu: {
            Btns: {
                "T.A.U." : {
                    Lbl: "TEMPO Automation Utility <br>(Mobile App)",
                    Type: "slideshow",
                    Description: {
                        Text: ["This is placeholder text."],
                        Bullets: [
                            "Bullet one",
                            "Bullet two",
                            "Bullet three"
                        ],
                    },
                    Src: [
                        "tau-1.png",
                        "tau-2.png",
                        "tau-3.png",
                        "tau-4.png"
                    ],
                    Icon: {
                        Type: "img",
                        Src: "imgs/tau.png"
                    }
                },
                Columnar: {
                    Lbl: "Columnar <br>(Web App)",
                    Type: "webApp",
                    Description: {
                        Text: ["This is placeholder text."],
                        Bullets: [
                            "Bullet one",
                            "Bullet two",
                            "Bullet three"
                        ],
                    },
                    Src: "https://sandbox-spud.firebaseapp.com/",
                    Img: "imgs/columnar.png",
                    Icon: {
                        Type: "img",
                        Src: "imgs/react.png"
                    }
                },
                VBRF: {
                    Lbl: "VBRF Digital Form <br>(Web App)",
                    Type: "webApp",
                    Description: {
                        Text: ["This is placeholder text."],
                        Bullets: [
                            "Bullet one",
                            "Bullet two",
                            "Bullet three"
                        ],
                    },
                    Src: "https://vbrf.spudlabs.com/",
                    Icon: {
                        Type: "icon",
                        Src: "fas fa-clipboard-list fa-2x"
                    }
                }
            },

            Init: function(elem) {
                this.Elem = elem;
            },

            Build: function() {
                let btns = this.Btns;

                // Close any already open content
                Content.Util.Close();

                // Activate the btn container
                this.Elem.className += " active";

                // Hide other btn containers
                Port.Util.Activate(this.Elem);

                // Animate border-radius change
                this.Elem.style.animation = "growCorner 0.425s ease 0s 1 normal forwards";

                // Grow the navbar
                setTimeout(function(){Content.Util.Activate(btns)}, 190);

                this.Elem.onclick = function() {Content.Util.Close()};
            },

            Close: function() {

                // Check to see if the element is active
                if(this.Elem.className !== "icon-container") {

                    this.Elem.className = "icon-container";
                    this.Elem.style.animation = "none";

                    Content.Util.Window.Close();
                    Content.Util.Deactivate();

                    this.Elem.onclick = function() {Content.Code.Menu.Build();}
                }
            }
        }
    },
    Writing: {
        Menu: {
            Btns: {
                DSC : {
                    Lbl: "Differential Scanning Calorimetry Manual <br>(PDF)",
                    Type: "document",
                    Description: {
                        Text: ["This is placeholder text."],
                        Bullets: [
                            "Bullet one",
                            "Bullet two",
                            "Bullet three"
                        ],
                    },
                    Src: "docs/DSC_SOP.pdf",
                    Icon: {
                        Type: "icon",
                        Src: "fas fa-file-alt fa-2x",
                    }
                },
            },

            Init: function(elem) {

                this.Elem = elem;
            },

            Build: function() {
                let btns = this.Btns;

                // Close any already open content
                Content.Util.Close();

                // Activate the btn container
                this.Elem.className += " active";

                // Hide other btn containers
                Port.Util.Activate(this.Elem);

                // Animate border-radius change
                this.Elem.style.animation = "growCorner 0.4s ease 0s 1 normal forwards";

                // Grow the navbar
                setTimeout(function(){Content.Util.Activate(btns)}, 190);

                this.Elem.onclick = function() {Content.Util.Close()};
            },

            Close: function() {

                // Check to see if the element is active
                if(this.Elem.className !== "icon-container") {

                    this.Elem.className = "icon-container";
                    this.Elem.style.animation = "none";

                    Content.Util.Deactivate();

                    this.Elem.onclick = function() {Content.Writing.Menu.Build();}
                }  
                
            }
        }
    },
    Misc: {
        Menu: {
            Btns: {

            },

            Init: function(elem) {

                this.Elem = elem;
            },

            Build: function() {
                let btns = this.Btns;

                // Close any already open content
                Content.Util.Close();

                // Activate the btn container
                this.Elem.className += " active";

                // Hide other btn containers
                Port.Util.Activate(this.Elem);

                // Animate border-radius change
                this.Elem.style.animation = "growCorner 0.4s ease 0s 1 normal forwards";

                // Grow the navbar
                setTimeout(function(){Content.Util.Activate(btns)}, 190);

                this.Elem.onclick = function() {Content.Util.Close()};
            },

            Close: function() {
                
                // Check to see if the element is active
                if(this.Elem.className !== "icon-container") {

                    this.Elem.className = "icon-container";
                    this.Elem.style.animation = "none";

                    Content.Util.Deactivate();

                    this.Elem.onclick = function() {Content.Misc.Menu.Build();}
                }
            }
        }
    }
}