import React from 'react';
import axios from 'axios';

const GET_EMPLOYEES = `
query getEmployees {
    employees{
      employee_name
      employee_age
      employee_salary
    }
  }`

class Employees extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            employees: this.props.employees ? this.props.employees : []
        }
    }

    crawlData = async (event) => {
        event.preventDefault();
        const { employees } = this.state;
        await axios({
            url: 'http://localhost:3000/graphql',
            method: 'post',
            data: {
                query: `
                mutation crawlEmployees {
                    crawl{
                      mess 
                      crawledEmployees {
                        employee_name
                        employee_age
                        employee_salary
                      }
                    }
                  }
                `
            }
        }).then(res => {
            const newEmployees = employees.concat(res.data.data.crawl.crawledEmployees);
            this.setState({
                employees: newEmployees
            })
        }).catch(err => console.log(err))
    }

    render() {
        return (
            <>
                <button onClick={this.crawlData}>Crawl</button>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Salary</th>
                    </tr>
                    {this.state.employees || this.state.employees !== [] ? this.state.employees.map((e, i) => {
                        return (
                            <tr key={i}>
                                <td>{e.employee_name}</td>
                                <td>{e.employee_age}</td>
                                <td>{e.employee_salary}</td>
                            </tr>
                        )
                    }) : null}
                </table>
            </>
        )
    }
}

export async function getServerSideProps(ctx) {
    return await axios({
        url: 'http://localhost:3000/graphql',
        method: 'post',
        data: {
            query: `
            query getEmployees {
                employees{
                  employee_name
                  employee_age
                  employee_salary
                }
              }`
        }
    }).then(res => {
        return {
            props: {
                employees: res.data.data.employees
            }
        }
    }).catch(err => console.log(err))

}
export default Employees