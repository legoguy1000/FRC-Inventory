import { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router";
import { PartService } from '../../Services/PartService';
import { NavTitleContext } from '../../App'
import { Grid2, Stack } from '@mui/material';
import { Part as PartInterface } from '../../../../server/src/interfaces'

export default function Part() {
    let params = useParams();
    const [loading, setLoading] = useState(false);
    const [part, setPart] = useState<PartInterface>();
    const { setTitle } = useContext(NavTitleContext);

    useEffect(() => {
        const loadPost = async () => {
            // Till the data is fetch using API
            // the Loading page will show.
            // setLoading(true);

            // // Await make wait until that
            // // promise settles and return its result
            // const response = await PartService.getPart(params.partId);
            // console.log(response)
            // // // After fetching data stored it in posts state.
            // setPart(response);

            // // Closed the loading page
            // setLoading(false);
            // setTitle(`${response.vendor} ${response.name}`)
        };

        // Call the function
        loadPost();
    }, []);

    return (
        <Grid2>
            <Stack>
                {JSON.stringify(part)}
            </Stack>
            <Stack>
                <img src={part?.image_url} />
            </Stack>
        </Grid2>
    )
}
