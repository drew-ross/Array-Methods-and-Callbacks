import { fifaData } from './fifa.js';
console.log(fifaData);


// ⚽️ M  V P ⚽️ //

/* Task 1: Investigate the data above. Practice accessing data by console.log-ing the following pieces of data 

(a) Home Team name for 2014 world cup final
(b) Away Team name for 2014 world cup final
(c) Home Team goals for 2014 world cup final
(d) Away Team goals for 2014 world cup final
(e) Winner of 2014 world cup final */

let final2014 = fifaData.find(function (item) {
    return (item.Year === 2014 && item.Stage === 'Final');
});

function findWinner(game) {
    if (game["Home Team Goals"] > game["Away Team Goals"]) {
        return game["Home Team Name"];
    } else {
        return game["Away Team Name"];
    }
}

console.log(final2014["Home Team Name"]);
console.log(final2014["Away Team Name"]);
console.log(final2014["Home Team Goals"]);
console.log(final2014["Away Team Goals"]);
console.log(findWinner(final2014));

/* Task 2: Create a function called  getFinals that takes `data` as an argument and returns an array of objects with only finals data */

function getFinals(data) {
    const result = data.filter(item => item.Stage === "Final")
    return result;
};

console.log("getFinals:");
console.log(getFinals(fifaData));

/* Task 3: Impliment a higher-order function called `getYears` that accepts the callback function `getFinals`, and returns an array called `years` containing all of the years in the dataset */

function getYears(data, callback) {
    const years = [];
    const newData = callback(data);
    newData.forEach(function (item) {
        years.push(item.Year);
    })
    return years;
};

console.log("getYears");
console.log(getYears(fifaData, getFinals));

/* Task 5: Impliment a higher-order function called `getWinners`, that accepts the callback function `getFinals()` and determine the winner (home or away) of each `finals` game. Return the name of all winning countries in an array called `winners` */

function getWinners(data, callback) {
    const winners = [];
    const newData = callback(data);
    newData.forEach(function (item) {
        if (item["Home Team Goals"] > item["Away Team Goals"]) {
            winners.push(item["Home Team Name"]);
        } else {
            winners.push(item["Away Team Name"]);
        }
    })
    return winners;
};

console.log("getWinners");
console.log(getWinners(fifaData, getFinals));

/* Task 6: Implement a higher-order function called `getWinnersByYear` that accepts the following parameters and returns a set of strings "In {year}, {country} won the world cup!" 

Parameters: 
 * callback function getWinners
 * callback function getYears
 */

function getAllWinners(data, cbGetFinals, cbFindWinner) {
    const finals = cbGetFinals(data);
    const winners = [];
    finals.forEach(function (item) {
        const year = item.Year;
        const winner = cbFindWinner(item);
        winners.push(`In ${year}, the winner was ${winner}`);
    })
    return winners;
};

console.log(getAllWinners(fifaData, getFinals, findWinner));

/* Task 7: Create a function called `getCountryWins` that takes the parameters `data` and `team initials` and returns the number of world cup wins that country has had. 

Hint: Investigate your data to find "team initials"!
Hint: use `.reduce` */

function getCountryWins(data, teamInitials, cbGetFinals) {
    const finals = cbGetFinals(data);
    const wins = finals.reduce(function (total, current) {
        const homeWins = (current["Home Team Goals"] > current["Away Team Goals"]);
        if ((homeWins && current["Home Team Initials"] === teamInitials) || !homeWins && current["Away Team Initials"] === teamInitials) {
            return total + 1;
        } else {
            return total;
        }
    }, 0)
    return wins;
};

console.log("getCountryWins for Italy (ITA)");
console.log(getCountryWins(fifaData, "ITA", getFinals));


/* Task 8: Write a function called getGoals() that accepts a parameter `data` and returns the team with the most goals score per appearance (average goals for) in the World Cup finals */

function getGoals(data, callback) {
    const finals = callback(data);
    const names = [];
    const newData = [];
    let highestAverage = 0;
    const teamsWithHighest = [];
    finals.forEach(function (item) {
        if (!names.find(name => item["Home Team Name"] === name)) {
            names.push(item["Home Team Name"]);
        }
        if (!names.find(name => item["Away Team Name"] === name)) {
            names.push(item["Away Team Name"]);
        }
    })
    names.forEach(function (item) {
        newData.push({ country: item, appear: 0, score: 0 });
    })
    finals.forEach(function (item) {
        const homeName = item["Home Team Name"];
        const awayName = item["Away Team Name"];
        const homeScore = item["Home Team Goals"];
        const awayScore = item["Away Team Goals"];
        newData.forEach(function (item) {
            if (item.country === homeName) {
                item.appear += 1;
                item.score += homeScore;
            } else if (item.country === awayName) {
                item.appear += 1;
                item.score += awayScore;
            }
        })
    })
    newData.forEach(function (item) {
        const average = item.score / item.appear;
        item.average = average;
    })
    newData.forEach(function (item) {
        if (item.average > highestAverage) {
            highestAverage = item.average;
        }
    })
    newData.forEach(function (item) {
        if (item.average === highestAverage) {
            teamsWithHighest.push(item.country);
        }
    })
    console.log(newData);
    return teamsWithHighest;
};

console.log(getGoals(fifaData, getFinals));


/* Task 9: Write a function called badDefense() that accepts a parameter `data` and calculates the team with the most goals scored against them per appearance (average goals against) in the World Cup finals */

function badDefense(data, callback) {
    const finals = callback(data);
    const names = [];
    const newData = [];
    let highestAverage = 0;
    const teamsWithHighest = [];
    finals.forEach(function (item) {
        if (!names.find(name => item["Home Team Name"] === name)) {
            names.push(item["Home Team Name"]);
        }
        if (!names.find(name => item["Away Team Name"] === name)) {
            names.push(item["Away Team Name"]);
        }
    })
    names.forEach(function (item) {
        newData.push({ country: item, appear: 0, againstScore: 0 });
    })
    finals.forEach(function (item) {
        const homeName = item["Home Team Name"];
        const awayName = item["Away Team Name"];
        const homeScore = item["Home Team Goals"];
        const awayScore = item["Away Team Goals"];
        newData.forEach(function (item) {
            if (item.country === homeName) {
                item.appear += 1;
                item.againstScore += awayScore;
            } else if (item.country === awayName) {
                item.appear += 1;
                item.againstScore += homeScore;
            }
        })
    })
    newData.forEach(function (item) {
        const average = item.againstScore / item.appear;
        item.average = average;
    })
    newData.forEach(function (item) {
        if (item.average > highestAverage) {
            highestAverage = item.average;
        }
    })
    newData.forEach(function (item) {
        if (item.average === highestAverage) {
            teamsWithHighest.push(item.country);
        }
    })
    console.log(newData);
    return teamsWithHighest;
};

console.log(badDefense(fifaData, getFinals));


/* Task 10: Write a function called `getAverageGoals` that accepts a parameter `data` and returns the the average number of home team goals and away team goals scored per match (Hint: use .reduce and do this in 2 steps) */

function getAverageGoals(data) {

    /* code here */

};

getAverageGoals();


/// STRETCH 🥅 //

/* Use the space below to work on any stretch goals of your chosing as listed in the README file. */