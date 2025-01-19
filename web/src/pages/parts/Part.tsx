import { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router";
import NavService from '../../Services/NavigationService'
import PartService from '../../Services/PartService';
import { NavTitleContext } from '../../main'


export default function Part() {
    let params = useParams();
    const [loading, setLoading] = useState(false);
    const [part, setPart] = useState({});
    const { setTitle } = useContext(NavTitleContext);

    useEffect(() => {
        const loadPost = async () => {
            // Till the data is fetch using API
            // the Loading page will show.
            setLoading(true);

            // Await make wait until that
            // promise settles and return its result
            const response = await PartService.getPart(params.pid);
            console.log(response)
            // // After fetching data stored it in posts state.
            setPart(response);

            // Closed the loading page
            setLoading(false);
            setTitle(`${response.vendor} ${response.name}`)
        };

        // Call the function
        loadPost();
    }, []);

    return (
        <div>{JSON.stringify(part)}</div>
    )
}
