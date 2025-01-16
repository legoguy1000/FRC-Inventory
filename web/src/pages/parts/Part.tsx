import React from 'react';
import { useParams } from "react-router";
import NavService from '../../Services/NavigationService'

export default function Part() {
    let params = useParams();

    NavService.setPageTitle("Vex Falcon 500")
    return (
        <div>{params.pid}</div>
    )
}
