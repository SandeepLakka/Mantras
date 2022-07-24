import React, {useEffect, useRef, useState} from "react";
import {
    View, Text, StyleSheet, SafeAreaView,
    Dimensions, Image, TouchableOpacity,
    FlatList, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import songs from './model/data';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');


  
const Player = () => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [songIndex, setSongIndex] = useState(0);
    //const [toPlay, setToPlay] = useState();
    const [isPlaying, setIsPlaying] = useState(false);

    const songSlider = useRef(null);
    const sound = useRef(new Audio.Sound());

    useEffect(() => {
        
        

        scrollX.addListener((value) => {
            const index = Math.round(value.value / width);
            setSongIndex(index);
            console.log("song index : ", songIndex);
            console.log("song being loaded : ", songs[songIndex].url);
            //loadSong();
            //console.log("toPlay is ", toPlay);
        })
        

        
        return () => {
            sound.current.unloadAsync();
            scrollX.removeAllListeners();
        };
    }, []);

    async function loadSong() {
        console.log(songs[songIndex]);
        const isSongExists = await sound.current.getStatusAsync();
        // if (isSongExists.isLoaded === false) {
        //     while (!isSongExists.isLoaded) {
        //         console.log("Sleeping for a second to have the previous audio loaded");
        //         sleep(1000);
        //     }
            
        // }
        console.log("prev song is loaded? : ", isSongExists.isLoaded);

        if (isSongExists.isLoaded === true) {
            console.log("song already loaded, unloading it");
            await sound.current.unloadAsync();
        }

        await Audio.setAudioModeAsync({
            staysActiveInBackground: true,
        })
        const { toBePlayed } = await sound.current.loadAsync(songs[songIndex].url);
        //const { toBePlayed } = await sound.current.createAsync(songs[songIndex].url);
        const isLoaded = await sound.current.getStatusAsync();
        if (isLoaded.isLoaded === true) {
            console.log("Song loaded properly");
            //await sound.current.playAsync();
        } else {
            console.log("Error in loading file");
        }
        //const { toBePlayed } = await sound.current.createAsync(require('./assets/gayathri.mp3'));
        //console.log("----",toBePlayed)
        //setToPlay(toBePlayed);
        console.log("song is loaded");
    }
    useEffect(() => {
        setIsPlaying(false);
        console.log("songIndex is = ", songIndex);
        loadSong();
        //console.log("toPlay is ", toPlay);
    }, [songIndex]);

    // useEffect(() => {
    //     console.log("toPlay v2 ris ", toPlay);
    //     return toPlay
    //       ? () => {
    //           console.log('Unloading Sound');
    //           toPlay.unloadAsync(); }
    //       : undefined;
    //   }, [toPlay]);

    //Audio controls logic

    // const togglePlayback = async (playbackState) => {
    //     const currentTrack = await songs[songIndex]
    
    //     if (currentTrack !== null) {
    //         if (playbackState == State.Paused) {
    //             await TrackPlayer.play();
    //         } else {
    //             await TrackPlayer.pause();
    //         }
    //     }
    // }

    const togglePlayback = async () => {
        console.log("play/pause is pressed");

        try {
           
            const result = await sound.current.getStatusAsync();
          
            if (result.isPlaying === false) {
                await sound.current.playAsync();
            } else {
                await sound.current.pauseAsync();
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const sleep = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      
    const togglePlaybackV1 = async () => {
        const status = await sound.current.getStatusAsync();
        console.log("--> status : ", status);
        console.log("--> isLoaded : ", (await status).isLoaded);
        // while (!status.isLoaded) {
        //     console.log("sleeping for a second till the song loads");
        //     sleep(1000);
        // }
        console.log("-- final load status : ", status.isLoaded);
    
        if (status.isPlaying === false) {
            setIsPlaying(true);
            await sound.current.playAsync();
        } else {
            setIsPlaying(false);
            await sound.current.pauseAsync();
        }
        //await sound.current.playAsync(); 
    }

    const skipToNext = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex + 1) * width, 
        })
    }

    const skipToPrevious = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex - 1) * width, 
        })
    }

    const renderSongs = ({ index, item }) => {
        return (
            <Animated.View style={{
                width: width,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={styles.artWorkWrapper}>
                    <Image
                        style={styles.artWorkImg}
                        source={item.artwork}
                    />
                </View>
            </Animated.View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            {/*Container for the Main application UI*/}
            <View style={styles.mainContainer}>
                <View style={{width: width}}>
                    <Animated.FlatList
                    ref={songSlider}
                    data={songs}
                    renderItem={renderSongs}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{nativeEvent: {
                            contentOffset: {x: scrollX}
                        }
                        }],
                        {useNativeDriver: true}
                    )}
                    />
                </View>
        
                {/*Title of the Stotra/Chant*/}
                <Text style={styles.title}>{songs[songIndex].title}</Text>

                {/*Container for Slider of the audio */}
                {/*
                <View>
                    <Slider
                        style={styles.progressContainer}
                        value={10}
                        minimumValue={0}
                        maximumValue={100}
                        thumbTintColor="#FFD369"
                        minimumTrackTintColor="#FFD369"
                        maximumTrackTintColor="#FFF"
                        onSlidingComplete={() => { }}
                    />
                </View>
                */}
                
                
                {/*Container for the audio timestamp*/}
                {/*
                <View style={styles.progressLabelContainer}>
                    <Text style={styles.progressLabelTxt}>0:00</Text>
                    <Text style={styles.progressLabelTxt}>3:45</Text>
                </View>
                    */}
                {/*Container for the audio controls */}
                <View style={styles.musicControls}>
                    <TouchableOpacity onPress={skipToPrevious}>
                        <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" style={{marginTop: 25}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlaybackV1}>
                        <Ionicons name={isPlaying ? "ios-pause-circle": "ios-play-circle"} size={75} color="#FFD369"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={skipToNext}>
                        <Ionicons name="play-skip-forward-outline" size={35} color="#FFD369" style={{marginTop: 25}} />
                    </TouchableOpacity>
                </View> 



            </View>    
            
            {/* bottom container */}
            <View style={styles.bottomContainer}>
                <View style={styles.bottomControls}>
                    <Ionicons name="repeat" size={30} color="#777777"/>
                    <Ionicons name="heart-outline" size={30}  color="#777777"/>
                </View>
            </View>            
    </SafeAreaView>
    
    )};

   const styles = StyleSheet.create({
    bottomContainer: {
        borderTopColor: '#393E46',
        borderTopWidth: 1,
        width: width,
        alignItems: 'center',
        paddingVertical: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#EEEEEE'
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    progressContainer: {
        width: 350,
        height: 40,
        marginTop: 25,
        flexDirection: 'row'
    },
    progressLabelContainer: {
        width: 340,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    progressLabelTxt: {
        color: "#FFF"
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
           flex: 1,
           backgroundColor: "#222831",
    },
    artWorkWrapper: {
        width: 300,
        height: 340,
        marginBottom: 25,
    },
    artWorkImg: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    musicControls: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'space-between',
        marginTop: 15
    }
       
   }) 

export default Player;