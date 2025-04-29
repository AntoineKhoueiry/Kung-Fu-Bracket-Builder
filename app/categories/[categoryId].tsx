import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import ZoomAndPanWrapper from "../components/ZoomAndPanWrapper";
import { useRef } from "react";




export default function BracketScreen() {
  const zoomWrapperRef = useRef<any>(null);

  const { categoryId } = useLocalSearchParams();
  const [rounds, setRounds] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchPlayers();
    }
  }, [categoryId]);


  const fetchPlayers = async () => {
    try {
      console.log("🌐 Frontend: Fetching players for categoryId:", categoryId);
  
      const response = await axios.get(`${BACKEND_URL}/api/players/category/${categoryId}`);
      
      console.log("📬 Frontend: Received response:", response.data);
      const playersList = response.data.players;
      console.log("🧩 Frontend: playersList:", playersList);
  
  
      createBracket(playersList);
      } catch (error: any) {
        console.error("🚨 Frontend error fetching players:", error?.response?.data || error.message);
      } finally {
      setLoading(false);
    }
  };
  

  const createBracket = (playersList: any[]) => {

    console.log("🎯 createBracket: received playersList:", playersList);

    if (playersList.length === 0) {
      console.log("⚠️ No players to create bracket!");
    }
    
    const shuffled = [...playersList].sort(() => 0.5 - Math.random());
    const initialMatches = [];

    // Step 1: Create first round
    for (let i = 0; i < shuffled.length; i += 2) {
      initialMatches.push({
        player1: shuffled[i]?.fullName || "TBD",
        player2: shuffled[i + 1]?.fullName || "BYE",
        winner: null,
        matchId: i / 2 + 1,
      });
    }

    const allRounds = [initialMatches];

    // Step 2: Create empty future rounds
    let prevRound = initialMatches;
    while (prevRound.length > 1) {
      const nextRound = [];
      for (let i = 0; i < prevRound.length; i += 2) {
        nextRound.push({
          player1: `Winner of Match ${prevRound[i]?.matchId}`,
          player2: prevRound[i + 1] ? `Winner of Match ${prevRound[i + 1]?.matchId}` : "BYE",
          winner: null,
          matchId: allRounds.flat().length + nextRound.length + 1,
        });
      }
      allRounds.push(nextRound);
      prevRound = nextRound;
    }

    setRounds(allRounds);
  };

  const handleSelectWinner = (roundIndex: number, matchIndex: number) => {
    const match = rounds[roundIndex][matchIndex];

    if (!match.player2 || match.player2 === "BYE") {
      // Auto select player1 if no opponent
      updateWinner(roundIndex, matchIndex, match.player1);
      return;
    }

    Alert.alert(
      "Select Winner",
      `Who won the match?`,
      [
        { text: match.player1, onPress: () => updateWinner(roundIndex, matchIndex, match.player1) },
        { text: match.player2, onPress: () => updateWinner(roundIndex, matchIndex, match.player2) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };


  const updateWinner = (roundIndex: number, matchIndex: number, winnerName: string) => {
    const updatedRounds = [...rounds];
    updatedRounds[roundIndex][matchIndex].winner = winnerName;

    // If there is a next round, update it
    if (updatedRounds[roundIndex + 1]) {
      const nextMatchIndex = Math.floor(matchIndex / 2);
      const isPlayer1 = matchIndex % 2 === 0;

      if (isPlayer1) {
        updatedRounds[roundIndex + 1][nextMatchIndex].player1 = winnerName;
      } else {
        updatedRounds[roundIndex + 1][nextMatchIndex].player2 = winnerName;
      }
    }

    setRounds(updatedRounds);
  };

  const getRoundTitle = (roundIndex: number, totalRounds: number) => {
    if (roundIndex === totalRounds - 1) return "Final";
    if (roundIndex === totalRounds - 2) return "Semi Finals";
    if (roundIndex === totalRounds - 3) return "Quarter Finals";
    if (roundIndex === totalRounds - 4) return "Round of 16";
    return `Round ${roundIndex + 1}`;
  };
  
  

  if (loading) {
    return (
      <>
        <Header title="Bracket" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </>
    );
  }

  console.log("Rounds state:", rounds);


  return (
    <>
      <Header title="Bracket" showBack />
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <>
            <ScrollView horizontal contentContainerStyle={{ padding: 0 }}>
              <ZoomAndPanWrapper ref={zoomWrapperRef} contentWidth={rounds.length * 200 + 100}>
                {rounds.map((round, roundIndex) => {
                  const isFinalRound = roundIndex === rounds.length - 1;
                  const finalMatch = round[0]; // Final match will be the only one in the final round
  
                  return (
                    <View key={roundIndex} style={styles.roundContainer}>
                      {/* 🏆 Trophy above Final Round */}
                      {isFinalRound && (
                        <View style={{ alignItems: "center", marginBottom: 10 }}>
                          <Text style={{ fontSize: 30 }}>🏆</Text>
                        </View>
                      )}
  
  <Text style={styles.roundTitle}>
  {getRoundTitle(roundIndex, rounds.length)}
</Text>

  
                      {round.map((match, matchIndex) => (
                        <TouchableOpacity 
                          key={match.matchId}
                          style={[styles.matchContainer, isFinalRound && styles.finalMatchContainer]}
                          onPress={() => handleSelectWinner(roundIndex, matchIndex)}
                        >
                          <Text style={styles.playerName}>{match.player1}</Text>
                          <Text style={styles.vs}>VS</Text>
                          <Text style={styles.playerName}>{match.player2}</Text>
                          
                          {/* Show winner inside match */}
                          {match.winner && (
                            <Text style={styles.winner}>🏆 {match.winner}</Text>
                          )}
                        </TouchableOpacity>

                        
                      ))}
  
                      {/* 🎖️ Winner name under Trophy */}
                      {isFinalRound && finalMatch?.winner && (
                        <View style={{ alignItems: "center", marginTop: 10 }}>
                          <Text style={{ fontSize: 18, fontWeight: "bold", color: "green" }}>
                            {finalMatch.winner}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </ZoomAndPanWrapper>
            </ScrollView>
  
            {/* Fixed Zoom Controls */}
            <View style={{
              position: 'absolute',
              top: 30,
              right: 20,
              flexDirection: 'row',
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 10,
              padding: 5,
              zIndex: 10,
            }}>
              <TouchableOpacity
                onPress={() => {
                  zoomWrapperRef.current?.zoomOut();
                }}
                style={{
                  width: 40,
                  height: 40,
                  padding: 10,
                  marginHorizontal: 5,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  elevation: 5,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>➖</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                onPress={() => {
                  zoomWrapperRef.current?.zoomIn();
                }}
                style={{
                  width: 40,
                  height: 40,
                  padding: 10,
                  marginHorizontal: 5,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  elevation: 5,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: 'bold' }}>➕</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
  
  
  
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  roundContainer: { marginRight: 20, alignItems: "center" },
  roundTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  matchContainer: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 20, 
    width: 180,
    alignItems: "center"
  },
  playerName: { fontSize: 16, fontWeight: "500" },
  vs: { fontSize: 14, marginVertical: 8 },
  winner: { marginTop: 10, color: "green", fontWeight: "bold" },
  finalMatchContainer: {
    backgroundColor: "#dff0d8", // Light green to highlight final match
    borderColor: "green",
    borderWidth: 2,
  },
});
