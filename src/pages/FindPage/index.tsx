import React from 'react';
import styled from 'styled-components';
import Card from "./Card";
import useAppSelector from "../../app/hooks/useAppSelector";
import {selectUser} from "../../store/user/user.slice";
import Typography from '@mui/material/Typography';
import {ISearch, ReactionType, UserRole} from "../../store/user/user.types";
import {useLazySearchQuery, useReactionMutation} from "../../store/user/user.api";

interface IFindPageProps {

}

const FindPage: React.FC<IFindPageProps> = ({}) => {
    const userInfo = useAppSelector(selectUser)

    const [search, {data}] = useLazySearchQuery()
    const [reaction, {}] = useReactionMutation()

    // const [data, setData] = React.useState(vanila_data)
    const [currentItem, setCurrentItem] = React.useState<ISearch>(null)
    const [end, setEnd] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (userInfo) {
            search()
        }
    }, [userInfo])

    React.useEffect(() => {
        if (!currentItem && data?.length > 0) {
            setCurrentItem(data[0])
        }
    }, [data, currentItem])

    const next = () => {
        const idx = data.findIndex(i => i.id === currentItem.id)

        if (idx === -1 || idx + 1 === data.length) {
            setEnd(true)
            setCurrentItem(null)
            return void 0;
        }

        setCurrentItem(data[idx+1])
    }

    const onLike = () => {
        reaction({
            targetId: currentItem.id,
            type: ReactionType.LIKE
        })
        next()
    }

    const onDislike = () => {
        reaction({
            targetId: currentItem.id,
            type: ReactionType.DENY
        })
        next()
    }

    const onSkip = () => {
        next()
    }

    if (!userInfo) return <></>
    return (
        <FindPageStyled className="mt-10">
            <div className="container">
                <div className="row justify-center">
                    <div className="col-12 col-sm-8 col-md-6 ">
                        <Typography variant="h5" gutterBottom className="mb-5 uppercase">
                            {`Find ${userInfo.owner.role === UserRole.DEVELOPER ? 'JOB' : 'DEVELOPER'}`}
                        </Typography>
                        {end
                            ? <Typography variant="h6" gutterBottom className="mb-5">
                                {`The ${userInfo.owner.role === UserRole.DEVELOPER ? 'job list' : 'list of developers'} is empty`}
                            </Typography>
                            : currentItem &&
                            <Card
                                role={userInfo.owner.role}
                                data={currentItem}
                                onLike={onLike}
                                onDislike={onDislike}
                                onSkip={onSkip}
                            />
                        }
                    </div>
                </div>
            </div>
        </FindPageStyled>
    )
};

const FindPageStyled = styled.div`
  //width: 100vw;
  background-color: #2d2d2d;
  padding: 80px 0;

  h1 {
    color: #fff;
  }
`

export default (FindPage);
