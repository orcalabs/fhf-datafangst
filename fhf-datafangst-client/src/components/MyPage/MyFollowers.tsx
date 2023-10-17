
import { PersonAdd, PersonRemove } from "@mui/icons-material"
import { Box, Divider, IconButton, Typography } from "@mui/material"
import { VesselFilter } from "components/Filters/VesselFilter"
import { Vessel } from "generated/openapi"
import { FC } from "react"
import { selectVesselsByCallsign, useAppDispatch, useAppSelector, selectUser, selectUserVessels, setSelectedVessels, updateUser } from "store"
import { VesselInfo } from "./VesselInfo"

export const VesselFinder: FC = () => {
    const dispatch = useAppDispatch()
    const vessels = useAppSelector(selectVesselsByCallsign)
    const followers = useAppSelector(selectUser);
    const selected_vessels = useAppSelector(selectUserVessels);


    const Content = () => selected_vessels.map((vessel) => {
        const isFollowing = followers?.following?.find((f) => f === vessel?.fiskeridir.id)

        return (
            <Box key={vessel.fiskeridir?.id} sx={{
               alignContent: "center",

            }}>
                <VesselInfo vessel={vessel}  />
                <IconButton  sx={{
                    color : "white",
                }}
                
                    onClick={() => {
                    // dispatch(updateUser({ ...followers, following: isFollowing ? followers?.following?.filter((f) => f !== vessel?.fiskeridir.id) : [...followers?.following ?? [], vessel?.fiskeridir.id] })
                    }} >
                    {!isFollowing ? <PersonAdd /> : <PersonRemove />}
                </IconButton>
             </Box>
        )
    })

    const onChange = (vessel?: Vessel[]) => {
        if (vessel === undefined) {

            dispatch(setSelectedVessels([]))
            return
        }
        dispatch(setSelectedVessels(vessel))


    }
    return (
        <Box sx={{

        }}
        >
            <VesselFilter onChange={onChange} value={selected_vessels} useVirtualization={true} />
            <Box sx={{
                width: "100%",
                height: "100%",
                color: "black",
                boxShadow: "none",
                borderColor: "primary.dark",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
            }}>

                {selected_vessels.length > 0 && <Content/>}
            </Box>
        </Box>
    )
}
