import React, { useState, useEffect } from 'react';
import './StylePoker.css';
import {
    logo, background, backCard,
    tenOfHearts, tenOfDiamonds, tenOfClubs, tenOfSpades,
    sevenOfHearts, sevenOfDiamonds, sevenOfClubs, sevenOfSpades,
    eightOfHearts, eightOfDiamonds, eightOfClubs, eightOfSpades,
    nineOfHearts, nineOfDiamonds, nineOfClubs, nineOfSpades,
    aceOfHearts, aceOfDiamonds, aceOfClubs, aceOfSpades,
    jackOfHearts, jackOfDiamonds, jackOfClubs, jackOfSpades,
    queenOfHearts, queenOfDiamonds, queenOfClubs, queenOfSpades,
    kingOfHearts, kingOfDiamonds, kingOfClubs, kingOfSpades
} from './CardImages';

const PokerGame: React.FC = () => {
    const [isStarted, setIsStarted] = useState(false);
    const [computerHand, setComputerHand] = useState<string[]>([]);
    const [playerHand, setPlayerHand] = useState<string[]>([]);
    const [announcement, setAnnouncement] = useState<string>(''); 
    const [cardsToReveal, setCardsToReveal] = useState<number>(0);
    const [isAnnouncementVisible, setIsAnnouncementVisible] = useState<boolean>(false);

    const deck = [
        tenOfHearts, tenOfDiamonds, tenOfClubs, tenOfSpades,
        sevenOfHearts, sevenOfDiamonds, sevenOfClubs, sevenOfSpades,
        eightOfHearts, eightOfDiamonds, eightOfClubs, eightOfSpades,
        nineOfHearts, nineOfDiamonds, nineOfClubs, nineOfSpades,
        aceOfHearts, aceOfDiamonds, aceOfClubs, aceOfSpades,
        jackOfHearts, jackOfDiamonds, jackOfClubs, jackOfSpades,
        queenOfHearts, queenOfDiamonds, queenOfClubs, queenOfSpades,
        kingOfHearts, kingOfDiamonds, kingOfClubs, kingOfSpades,
    ];

    const handleStartClick = () => {
        const deckCopy = [...deck];
        const computerCards = getRandomCards(deckCopy, 4);
        setComputerHand(computerCards);
        const playerCards = getRandomCards(deckCopy, 4);
        setPlayerHand(playerCards);
        setIsStarted(true);

        const computerAnnouncement = checkAnnouncement(computerCards);
        const playerAnnouncement = checkAnnouncement(playerCards);
        determineWinner(computerAnnouncement, playerAnnouncement, computerCards, playerCards);
        setCardsToReveal(8); // Start revealing cards
    };

    const getRandomCards = (deck: string[], numberOfCards: number) => {
        const selectedCards: string[] = [];
        for (let i = 0; i < numberOfCards; i++) {
            const randomIndex = Math.floor(Math.random() * deck.length);
            selectedCards.push(deck[randomIndex]);
            deck.splice(randomIndex, 1);
        }
        return selectedCards;
    };

    const checkAnnouncement = (hand: string[]): string => {
        const cardValues = hand.map(card => card.split('_')[0]);
        const counts = cardValues.reduce<Record<string, number>>((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        const pairs = Object.values(counts).filter(count => count === 2).length;
        const triples = Object.values(counts).filter(count => count === 3).length;
        const quads = Object.values(counts).filter(count => count === 4).length;

        if (quads > 0) return 'Carré';
        if (triples > 0) return 'Brelan';
        if (pairs > 1) return 'Double Paire';
        if (pairs === 1) return 'Paire';
        return "Pas d'annonce";
    };

    const determineWinner = (
        computerAnnouncement: string,
        playerAnnouncement: string,
        computerCards: string[],
        playerCards: string[]
    ) => {
        const announcementRanks: Record<string, number> = {
            '♣ Carré': 4,
            '♦ Brelan': 3,
            '♠ Double Paire': 2,
            '♥ Paire': 1,
            'Aucune annonce': 0
        };

        if (announcementRanks[computerAnnouncement] > announcementRanks[playerAnnouncement]) {
            setAnnouncement(`🥹 L'ordinateur gagne avec un ${computerAnnouncement} ! 😥`);
        } else if (announcementRanks[playerAnnouncement] > announcementRanks[computerAnnouncement]) {
            setAnnouncement(`🎉 Vous gagnez avec un ${playerAnnouncement} ! 🥳`);
        } else {
            const computerHighCard = getHighCard(computerCards);
            const playerHighCard = getHighCard(playerCards);
            setAnnouncement(
                computerHighCard > playerHighCard
                    ? "🥹 L'ordinateur gagne avec la carte la plus forte ! 😥"
                    : "🎉 Vous gagnez avec la carte la plus forte ! 🥳"
            );
        }
    };

    const getHighCard = (hand: string[]): number => {
        const cardOrder = ['7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
        return Math.max(
            ...hand.map(card => cardOrder.indexOf(card.split('_')[0]))
        );
    };

    const handleReplay = () => {
        setIsStarted(false);
        setComputerHand([]);
        setPlayerHand([]);
        setAnnouncement('');
        setCardsToReveal(0);
        setIsAnnouncementVisible(false);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cardsToReveal > 0) {
            timer = setInterval(() => {
                setCardsToReveal(prev => {
                    const newCount = prev - 1;
                    console.log(`carte ${newCount}`); 
                    if (newCount === 0) {
                        console.log("tour num "); 
                        setIsAnnouncementVisible(true); 
                    }
                    return newCount;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [cardsToReveal]);

    useEffect(() => {
        if (isAnnouncementVisible) {
            console.log("annonce"); 
        }
    }, [isAnnouncementVisible]);

    return (
        <div className="pokerGame">
            <img src={logo} alt="Logo" className="logo" />
            {isAnnouncementVisible && (
                <>
                    <p className="announcementText">{announcement}</p>
                    <button onClick={handleReplay} className="replayButton">
                        Rejouer
                    </button>
                </>
            )}
            <img src={background} alt="Background" className="backgroundImage" />
            <div className="gameArea">
                {!isStarted ? (
                    <button onClick={handleStartClick} className="startButton">
                        Démarrer le jeu
                    </button>
                ) : (
                    <div className="hands">
                        <div className="computerHand">
                            <h3>🤖 Main de l'ordinateur</h3>
                            <div className="card-container">
                                {computerHand.map((card, index) => (
                                    <div className={`card ${cardsToReveal > index ? 'flipped' : ''}`} key={index}>
                                        <img src={backCard} alt={`Back ${index + 1}`} className="back" />
                                        <img src={card} alt={`Card ${index + 1}`} className="front" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="playerHand">
                            <h3>🖐️ Votre main</h3>
                            <div className="card-container">
                                {playerHand.map((card, index) => (
                                    <div className={`card ${cardsToReveal > 4 + index ? 'flipped' : ''}`} key={index}>
                                        <img src={backCard} alt={`Back ${index + 1}`} className="back" />
                                        <img src={card} alt={`Card ${index + 1}`} className="front" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokerGame;
