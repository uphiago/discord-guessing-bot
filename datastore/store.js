const db = {
}

const addNewEntry = (gid, word) => {
    db[gid] = word;
}

const getWordLength = (gid) => {
    return db[gid].length
}

const deleteEntry = (gid) => {
    delete db[gid];
}

const getWordForGroup = (gid) => {
    return db[gid]
}

const checkGameStarted = (gid) => {
    if(db[gid]){
        return true
    }else {
        return false
    }
}

const isGameActive = (guildId) => {
    return db[guildId] ? true : false;
};

module.exports = {
    addNewEntry,
    getWordLength,
    getWordForGroup,
    checkGameStarted,
    deleteEntry,
    isGameActive
}