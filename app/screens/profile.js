import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from "../../config/config";

export default class upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
    }

    componentDidMount = () => {
        var that = this;
        f.auth().onAuthStateChanged(function(user) {
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

    render() {
        return <View style={{ flex: 1 }}>
            
            {this.state.loggedIn === true ? 
            
            <View style={{ flex: 1 }}>
                <View style={{ height: 70, paddingTop: 30, backgroundColor: "white", borderColor: "lightgray", borderBottomWidth: 0.5, justifyContent: "center", alignItems: "center" }}>
                  <Text>Profile</Text>
                </View>
                <View style={{justifyContent: "space-evenly", alignItems: 'center', flexDirection: 'row', paddingVertical: 10}}>
                    <Image source={{uri: 'https://api.adorable.io/avatars/285/test@user.i.png'}} style={{marginLeft: 10, width: 100, height: 100, borderRadius: 50}}/>
                    <View style={{marginRight: 10}}>
                        <Text>Name</Text>
                        <Text>@username</Text>
                    </View>
                    </View>

                    <View style={{paddingBottom: 20, borderBottomWidth: 1}}>
                        <TouchableOpacity style={{marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'gray', borderWidth: 1.5}}>
                            <Text style={{textAlign: 'center', color: 'gray'}}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 10, marginHorizontal: 40, paddingVertical: 15, borderRadius: 20, borderColor: 'gray', borderWidth: 1.5 }}>
                            <Text style={{ textAlign: 'center', color: 'gray' }}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = {() => this.props.navigation.navigate('Upload')}
                            style={{ marginTop: 10, marginHorizontal: 40, paddingVertical: 35, backgroundColor: 'gray', borderRadius: 20, borderColor: 'gray', borderWidth: 1.5 }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Upload Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgreen'}}>
                        <Text>Loading photos...</Text>
                    </View>

            </View> : 
              
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>You are not logged in.</Text>
                <Text>Please login to view your profile.</Text>
              </View>}
          </View>;
    }
}