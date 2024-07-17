/**
 * To insert cat data to the database
 * @param {String} Name - The Cat Alias
 * @param {String} Src - Source for the cat picture
 */
async function createCat(Name, Src) {
    const newData = await Cat.create({
        name: Name,
        src: Src
    })
    return console.log("Data has been created: ", newData.id);
}

module.exports = createCat;