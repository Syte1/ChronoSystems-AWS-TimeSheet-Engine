//Hard coded uid for now

async function main() {
  const uid = sessionStorage.getItem("user-id");
  try {
    const res = await fetch(`https://s2z6h094ph.execute-api.us-west-2.amazonaws.com/test/${uid}`)
    const data = await res.json()

    if (data.Items != undefined) {
      const table = document.getElementById('paystubTable');
      data.Items.forEach(item => {
        var row = `<tr>
                        <td>${item.start_period}</td>
                        <td>${item.end_period}</td>
                        <td>${item.uid}</td>
                        <td>${item.pay}</td>
                    </tr>`
        table.innerHTML += row;
      });
    }
  } catch (error) {
    console.log(error)
  }

}

main()
