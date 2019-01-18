import React from 'react';
import { TextInput, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from "../../config/config";
import { Permissions, ImagePicker } from 'expo';
import { TapGestureHandler } from 'react-native-gesture-handler';

export default class upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            imageID: this.uniqueID(),
            imageSelected: false,
            uploading: false,
            caption: '',
            progress: 0
        }
    }

    _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({camera: status})
        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll })
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function (user) {
            if (user) {
                //logged in
                that.setState({
                    loggedIn: true
                })
            } else {
                //not logged in
                that.setState({
                    loggedIn: false
                })
            }
        })
    }


    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    uniqueID = () => {
        return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4();    
    }

    findNewImage = async () => {
        this._checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result)
        if (!result.cancelled) {
            console.log('upload image');
            this.setState({
                imageSelected: true,
                imageID: this.uniqueID(),
                uri: result.uri
            })
        } else {
            console.log('cancelled')
            this.setState({
                imageSelected: false
            })
        }
    }

    uploadPublish = () => {
        if (this.state.uploading === false) {
            if (this.state.caption != '') {
                this.uploadImage(this.state.uri);
            } else {
                alert("please enter a caption...")
            }
        } else {
            console.log('ignore button tap as already uploading')
        }
    }

    uploadImage = async uri => {
        //
        var that = this;
        var userID = f.auth().currentUser.uid;
        var imageID = this.state.imageID;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });

        /*const response = await fetch(uri);
        const blob = await response.blob();*/
        var FilePath = imageID + "." + that.state.currentFileType;

        const oReq = new XMLHttpRequest();
        oReq.open("GET", uri, true);
        oReq.responseType = "blob";
        oReq.onload = () => {
            const blob = oReq.response;
            //Call function to complete upload with the new blob to handle the uploadTask.
            this.completeUploadBlob(blob, FilePath);
        };
        oReq.send();

        /*var uploadTask = storage.ref('user/'+userid+'/img').child(FilePath).put(blob);
     
        uploadTask.on('state_changed', function(snapshot){
          var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
          console.log('Upload is '+progress+'% complete');
          that.setState({
            progress:progress,
          });
        }, function(error) {
          console.log('error with upload - '+error);
        }, function(){
          //complete
          that.setState({progress:100});
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
            console.log(downloadURL);
            that.processUpload(downloadURL);
          });
     
        });*/
    };

    completeUploadBlob = (blob, FilePath) => {
        var that = this;
        var userID = f.auth().currentUser.uid;
        var imageID = this.state.imageID;

        var uploadTask = storage
            .ref("user/" + userID + "/img")
            .child(FilePath)
            .put(blob);

        uploadTask.on(
            "state_changed",
            function (snapshot) {
                var progress = (
                    (snapshot.bytesTransferred / snapshot.totalBytes) *
                    100
                ).toFixed(0);
                console.log("Upload is " + progress + "% complete");
                that.setState({
                    progress: progress
                });
            },
            function (error) {
                console.log("error with upload - " + error);
            },
            function () {
                //complete
                that.setState({ progress: 100 });
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log(downloadURL);
                    that.processUpload(downloadURL);
                });
            }
        );
    };

    processUpload = imageUrl => {
   
        var imageID = this.state.imageID;
        var userID = f.auth().currentUser.uid;
        var caption = this.state.caption;
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);

        var photoObj = {
            author: userID,
            caption: caption,
            posted: timestamp,
            url: imageUrl
        };

        //Update database

        //Add to main feed
        database.ref("/photos/" + imageID).set(photoObj);

        //Set user photos object
        database.ref("/users/" + userID + "/photos/" + imageID).set(photoObj);

        alert("Image Uploaded!!");

        this.setState({
            uploading: false,
            imageSelected: false,
            caption: "",
            uri: ""
        });
    };

    render() {
        return <View style={{ flex: 1 }}>
            {this.state.loggedIn === true ? 

            <View style={{ flex: 1 }}>
                {this.state.imageSelected=== true ? 
                (
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 70, paddingTop: 30, backgroundColor: "white", borderColor: "lightgray", borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}>
                            <Text>Upload</Text>
                        </View>
                        <View style={{ padding: 5 }}>
                            <Text style={{ marginTop: 5 }}>Caption:</Text>
                            <TextInput
                                editable={true}
                                placeholder={'Enter your caption...'}
                                maxLength={150}
                                multiline={true}
                                numberOfLine={4}
                                onChangeText={(text) => this.setState({caption: text})}
                                style={{marginVertical:10, height:100, padding:5, borderColor: 'gray', borderWidth: 1, borderRadius: 3, backgroundColor: 'white', color: 'black'}}
                            />
                            <TouchableOpacity
                                onPress ={() => this.uploadPublish()}
                                style={{alignSelf:'center', width: 170, marginHorizontal: 'auto', backgroundColor: 'purple', borderRadius: 5, paddingVertical: 10, paddingHorizontal: 20 }}
                            >
                                <Text style={{textAlign: 'center', color: 'white'}}>Upload & Publish</Text>
                            </TouchableOpacity>
                            { this.state.uploading === true ? 
                            <View style={{marginTop: 10}}>
                                <Text>{this.state.progress}%</Text>
                                { this.state.progress != 100 ? 
                                <ActivityIndicator size="small"
                                color="blue" />
                                : <Text>Processing</Text>
                                }    
                            </View> : 
                            <View></View>
                            }
                            <Image
                                source={{uri: this.state.uri}}
                                style={{marginTop: 10, resizeMode: 'cover', width: '100%', height: 275 }}
                                />
                        </View>
                    </View>
                ) : (

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>
                        <TouchableOpacity
                            style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'blue', borderRadius: 5 }}
                            onPress={() => this.findNewImage()}
                        >
                            <Text style={{ color: 'white' }}>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                )}

                
            </View> : 
              
              <View>
                <Text>You are not logged in.</Text>
                <Text>Please login to upload a photo.</Text>
              </View>}
          </View>;
    }
}