import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {MapView, Location, Permissions} from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      mapRegion: null,
      hasLocationPermissions: false,
      locationResult: null,
      location: {coords: { latitude: 37.78825, longitude: -122.4324}},
      markers: [
        {
          title: 'nhon',
          coors: {
            latitude: 21.052671,
            longitude: 105.735504
          },
        },
        {
          title: 'le kham thjen',
          coors: {
            latitude: 21.001778,
            longitude: 105.803161
          },  
        },{
          title: 'tay ho',
          coors: {
            latitude: 21.056965,
            longitude: 105.794332
          },  
        },{
          title: 'cau giay',
          coors: {
            latitude: 21.032389,
            longitude: 105.792396
          },  
        },{
          title: 'giang vo',
          coors: {
            latitude: 21.027822,
            longitude: 105.824569
          },  
        }
      ]
    };
  }
  /** formula Haversine **/
  getDistanceFromLatLonInKm = (lat1, long1, lat2, long2) => {
    const R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);
    let dLong = this.deg2rad(long2-long1);
    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLong/2) * Math.sin(dLong/2); 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d*1000;
  }
  deg2rad = (deg) => {
    return deg*(Math.PI/180);
  }
  computedLocation = () => {
    let result = this.getDistanceFromLatLonInKm(this.state.markers[1].coors.latitude, 
      this.state.markers[1].coors.longitude, this.state.markers[0].coors.latitude,
      this.state.markers[0].coors.longitude)
    console.log(Math.round(result));
  }
  componentDidMount() {
    this.getLocaltionAsync();
  }
  getLocaltionAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({locationResult: 'Permission to access location was denied', location});
    } else {
      this.setState({hasLocationPermissions: true});
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({locationResult: JSON.stringify(location), location});
    // Center the map on the location we just fetched.
    this.setState({mapRegion: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0223, 
      longitudeDelta: 0.0113,
    }});
  }
  // handleMapRegionChange = (mapRegion) => {
  //   this.setState({mapRegion});
  // }
  render() {
    this.computedLocation();
    return (
      <View style={{flex: 1}}>
        {
          this.state.locationResult === null ?
          <Text>Finding your current location...</Text> :
          this.state.hasLocationPermissions === false ?
            <Text>Location permissions are not granted.</Text> :
            this.state.mapRegion === null ?
            <Text>Map region doesn't exist.</Text> :
            <MapView
              style={styles.map}
              region={this.state.mapRegion}
              //onRegionChange={this.handleMapRegionChange}
              showsBuildings={true}
              showsTraffic={true}
              showsIndoors={true}
              loadingIndicatorColor={'coral'}>
              {this.state.markers.map((marker, index) => {
                return (
                  <MapView.Marker 
                    key={index}
                    coordinate={marker.coors}
                    title={marker.title}
                    description={'This is your location'}>
                    <View style={styles.markerCircle}>
                      <View style={styles.subCircle}></View>
                    </View>
                  </MapView.Marker>
                );
              })}
              <MapView.Polyline
                coordinates={[this.state.markers[0].coors,this.state.markers[1].coors]}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeColors={[
                  '#7F0000',
                  '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                  '#B24112',
                ]}
                strokeWidth={3}
              />
            </MapView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  markerCircle: {
    height: 50,
    width: 50,
    borderRadius: 50/2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCircle: {
    height: 20,
    width: 20,
    borderRadius: 20/2,
    overflow: 'hidden',
    backgroundColor: '#007aff',
    borderWidth: 3,
    borderColor: 'white',
  }
});
