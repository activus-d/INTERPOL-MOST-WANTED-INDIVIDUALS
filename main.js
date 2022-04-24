let country = ''
let elementsArray = []; //new array to take in created elements
let mySelect = document.querySelector('select')
mySelect.addEventListener('click', () => {
    country =  mySelect.options[mySelect.selectedIndex].value 
  });

document.querySelector('button').addEventListener('click', function() {
    fetch(`https://ws-public.interpol.int/notices/v1/red?nationality=${country}`)
    .then( res => res.json() )
    .then( rawData => {
        console.log(rawData)
        if(rawData.total === 0) {
            let profiles = document.querySelector('.profiles')
            profiles.textContent = `NOTICE NOT AVAILABLE, TRY AGAIN LATER.`
        }else{
        document.querySelector('.profiles').textContent = ``
        let neededData = rawData._embedded.notices
        let profiles = document.querySelector(".profiles")

        //conditionanal syntax to remove created element from DOM on each click so as to clear Dom for the input of fresh data
        if(elementsArray.length !== 0) {
            elementsArray.forEach( function(item, index, arr) {
                item.remove();
            })
            elementsArray = [];
        }

        for ( let i = 0; i < neededData.length; i++ ) {    
            let newImg = document.createElement("img")
            if(neededData[i]._links.thumbnail==undefined){ newImg.src = `./Thumbnail.jpeg` }
            else{
                    newImg.src = neededData[i]._links.thumbnail.href
                }

                let newDiv = document.createElement("div")
                let newName = document.createElement("p")
                let newDob = document.createElement("p")

                elementsArray.push(newDiv);
                elementsArray.push(newImg);
                elementsArray.push(newName);
                elementsArray.push(newDob);

                newName.textContent = getName(neededData[i])
                newDob.textContent = neededData[i].date_of_birth

                profiles.appendChild(newDiv)
                newDiv.appendChild(newImg)
                newDiv.appendChild(newName)
                newDiv.appendChild(newDob)

                newDiv.classList.add("divStyle")
                document.querySelector('.options').style.borderRight = '0.5px solid rgb(155, 148, 148)'
            }
        }
    } )
    .catch( err => {
        console.log(`error: ${err}`)
    } )
})

//FUNCTION TO DET NAME FROM rawData
function getName(obj) {
    return `${obj.forename} ${obj.name}`
}
