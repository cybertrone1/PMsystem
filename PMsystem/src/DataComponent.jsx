import { useEffect, useState } from "react";

const DataComponent = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [comment, setComment] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");



    const fileHandler = (e) => {
        setFile(e.target.files[0]);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/data")
                if(!response.ok){
                    throw new Error("failed to fetch data");
                }

                const res = await response.json();
                console.log(res);
                setData(res);
            } catch (error) {
                setError(error.message);
            }finally{
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    
    const handleButton = async () => {

        if (!name || !file || !comment || !role) {
            setMessage("Please fill in all fields and select a file.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);
            formData.append('comment', comment);
            formData.append('role', role);
            
            const response = await fetch("http://localhost:5000/api/data", {
                method: "POST",
                body: formData,
            });
            
            if (!response.ok){
                throw new Error("failed to upload data");
            }
            const newData = await response.json();
            setData((prevData) => ([...prevData, newData]));
            setName("");
            setFile(null);
            setComment("");
            setRole("");
            setMessage("data upload succesfully")
        } catch (error) {
            setError(error.message);
        };
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div className="data-component">
            <div className="input-log">
                <form onSubmit={handleButton}>
                    <table>
                        <tr>
                            <th>
                                name
                            </th>
                            <th>
                                file
                            </th>
                            <th>
                                comment
                            </th>
                            <th>
                                role
                            </th>
                        </tr>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input className="input1" type="file"
                                    required
                                    onChange={fileHandler}
                                    />
                                </td>
                                <td>
                                    <textarea name="comment"
                                    placeholder="write a comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    >
                                    </textarea>
                                </td>
                                <td>
                                    <input type="text"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button type="submit">upload</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <p>{message}</p>
            </div>
            <div className="display-log">
                <h2>uploaded Data</h2>
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>comment</td>
                            <td>Role</td>
                            <td>file</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.comment}</td>
                            <td>{item.role}</td>
                            <td>{item.file}</td>
                            <td>
                                {item.file && (
                                    <a
                                        href={`http://localhost:5000/uploads/${item.file}`}
                                        download={item.file}
                                    >
                                        <button>Download</button>
                                    </a>
                                )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
     );
}
 
export default DataComponent;