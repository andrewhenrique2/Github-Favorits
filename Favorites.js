
export class GithubUser {
    static search (username) {
        const endpoint = `https://api.github.com/users/${username}`



        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({
          login,
          name,
          public_repos,
          followers
        }))
      }
    }



export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.tbody = this.root.querySelector('table tbody')

        this.load()

    }

    save() {
      localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
      }


      async add(username) {
       try {

        const userExist = this.entries.find(entry => entry.login === username)

        if (userExist) {
          throw new Error('Usuário já cadastrado')
        }

        const user = await GithubUser.search(username)
          if (user.login === undefined) {
            throw new Error('Usuário não encontrado!')
          }

          this.entries = [user, ...this.entries]
          this.update()
          this.save()


       } catch(error) {
        alert(error.message)
       }
       
      }



      delete(user) {
        const filteredEntries = this.entries
          .filter(entry => entry.login !== user.login)
    
        this.entries = filteredEntries
        this.update()
        this.save()
      }

}

/////////////////////////////////

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.seach button')
        addButton.onclick = () => {
          const { value } = this.root.querySelector('.seach input')
    
          this.add(value)
        }
      }


    update() {
        this.removeallTr()

      
        this.entries.forEach( user => {
            const row = this.createrow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            
            row.querySelector('.user img').alt = `Imagem de ${user.name}`

            row.querySelector('.user p').textContent = user.name
            
            row.querySelector('.user span').textContent = user.login

            row.querySelector('.repositores').textContent = user.public_repos

            
            row.querySelector('.seguidores').textContent = user.followers

            row.querySelector('.remover').onclick = () => {
             const isok = confirm('Tem certeza que deseja deletar essa linha?')

             if(isok) {
                this.delete(user)
             }
            }


            this.tbody.append(row)

        })


    }


    createrow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
   
        <td class="user">
         <img src="https://github.com/andrewchucrute.png" alt="Imagem do usuário">
         <a href="https://github.com/andrewchucrute" target="_blank"></a>
 
         
         <p class="name-user">Andrew Chucrute</p>
         <span class="url-user">/andrewchucrute</span>
 
 
 
     </td>
     <td class="repositores">78</td>
     <td class="seguidores">4545</td>
     <td class="remover"><button>Remover</button></td>

     `

        return tr
    }

    removeallTr() {
  
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove();
        })
    }
}

