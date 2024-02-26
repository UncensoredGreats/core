import React, { useState } from 'react';
import { ugd_backend } from '../declarations/ugd_backend';
import MessageContext from '../contexts/MessageContext';

interface MessageProviderProps {
  children: React.ReactNode;
}

interface MessageCard {
  user_query: string;
  message: string;
}

interface SourceCard {
  post_id: bigint;
  user_query: string;
  author: string;
  title: string;
  heading: string;
  content: string;
  summary: string;
  bookmarked: boolean;
};

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [isQuery, setIsQuery] = useState<string | undefined>()
  const [message, setMessage] = useState<MessageCard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAuthorId, setRandomAuthorId] = useState<string | null>(null);
  const [sourceCards, setSourceCards] = useState<any[]>([])
  const [bookmarkedSourceCards, setbookmarkedSourceCards] = useState<any[]>()


  const updateMessage = async (user_query: string) => {
    setIsLoading(true);
    try {

      // // This bullshit and all it's downstream freinds gotta go.
      // const response: MessageCard[] = await ugd_backend.mc_front(user_query);
      const response: MessageCard[] = [
        {
          user_query: "some query",
          message: "fhgjhkjljk;"
        },
        {
          user_query: "another query",
          message: "bru"
        }
      ];

      if (response && response.length > 0) {
        const firstResponse = response[0];
        setMessage({
          user_query: firstResponse?.user_query ?? "",
          message: firstResponse?.message ?? "",
        });
        setError(null);
        console.log("Response recieved: ", message)
      } else {
        setError("No response received from the backend");
      }

    } catch (error) {
      console.log(error)
      setError(`Failed to fetch the message`);
    } finally {
      setIsLoading(false);
    }
  };



  async function queryWeaviate(clusters: any, query: any) {
    setIsLoading(true)
    try {
      // const response = await ugd_backend.get_weaviate_query(query, 2, clusters);
      // console.log(`Weaviate Query Response for ${clusters}: `, response);

      // const jsonResponse = JSON.parse(response);
      // const postIds = jsonResponse.post_ids;

      // for (const id of postIds) {
      //   const sc_key = BigInt(id);
      //   const sourceCard = await ugd_backend.get_sc(sc_key);
      //   console.log("Source Card Key: ", sc_key, "—Full sourcecard data from get_sc()", sourceCard);
      //   setSourceCards((prev) => ([...prev, ...sourceCard]))
      // }

      setSourceCards([
        {
          author: 'The_Bible',
          title: 'Amos',
          post_id: 1,
          content: "Canada is the second-largest country in the world by land area, featuring vast landscapes that range from the Rocky Mountains to over 2,000 lakes and extensive forests. It has a diverse climate and equally diverse communities, with a strong emphasis on multiculturalism and bilingualism, primarily English and French. Canada is known for its natural beauty, wildlife, and is considered one of the world's most livable countries due to its advanced economy, healthcare, and education systems."
        },
        {
          author: 'The_Bible',
          title: 'Ezra',
          post_id: 2,
          content: "Alpacas are domesticated species of South American camelids, closely related to the llama. They are prized for their soft and luxurious fleece, which is sheared annually and used in a variety of textiles and garments. Alpacas are gentle and curious creatures, often raised in herds that graze on the level heights of the Andes in Peru, Bolivia, and Chile. Unlike their camelid cousins, alpacas are smaller and have more varied coat colors, ranging from white and black to various shades of brown and gray. They play a significant role in the cultural and economic practices of the Andean people, not only for their fleece but also as a symbol of natural harmony and sustainability"
        },
        {
          author: 'Sigmund_Freud',
          title: 'A General Introduction to Psychoanalysis',
          post_id: 3,
          content: "Cricket is a bat-and-ball game that is extremely popular in several countries, notably in the Commonwealth. It involves two teams of eleven players each, and the game is played on a circular field centered around a 22-yard-long pitch. At each end of the pitch, there are wickets comprising three stumps topped by two bails. The game's objective is to score runs by hitting the ball bowled at the wicket with a bat and running between the wickets or by the ball reaching the boundary. Cricket is known for its complex rules, including various forms of play such as Test matches, One Day Internationals (ODIs), and Twenty20 (T20), each with different durations and strategies. The sport is steeped in tradition and known for its spirit of fair play, making it a significant cultural phenomenon in countries like India, England, Australia, and Pakistan."
        },
        {
          author: 'The_Occult',
          title: 'Black Pullet',
          post_id: 4,
          content: "Computers are electronic devices designed to process data according to a set of instructions called a program, making them incredibly versatile tools capable of performing a wide range of tasks from simple calculations to complex simulations. Central to modern life, they vary in size and capability from tiny microprocessors embedded in everyday appliances to powerful supercomputers used for scientific research. Computers operate using binary code, a system of ones and zeros, to perform operations quickly and accurately, making them indispensable in fields such as business, medicine, entertainment, and science"
        },
        
      ])

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(`Error querying ${clusters}: `, error);
    }
  }

  async function GetQueriedSourceCards(query: any) {
    setIsQuery(query)
    setIsLoading(true)
    const clusters = ["The_Bible", "Carl_Jung", "Benjamin_Franklin"];

    const queryPromises = clusters.map(clusters => queryWeaviate(clusters, query));
    await Promise.allSettled(queryPromises);
  }




  return (
    <MessageContext.Provider value={{ message, updateMessage, isQuery, isLoading, error, currentAuthorId, setRandomAuthorId, GetQueriedSourceCards, sourceCards }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;



// const testSourceCards = async () => {

//   const postId: bigint = BigInt(14);

//   try {

//     // const weaviateQueryResponse = await ugd_backend.get_weaviate_query("Sample Query", 1, "The_Bible"); // "The_Bible" here is the 'cluster' element of the 'author_data.ts' object. The 1 is how many to return.
//     // console.log("Weaviate Query Response: ", weaviateQueryResponse);

//     // await ugd_backend.save_sc("Example Query", "Example Author", "Example Title", "Example Heading", "Example Content", "Example Summary");
//     // console.log("SourceCard saved successfully");

//     // const sourceCardResponse = await ugd_backend.get_sc(postId);
//     // console.log("SourceCard Response: ", sourceCardResponse);

//     // await ugd_backend.delete_sc(postId);
//     // console.log("SourceCard deleted successfully");

//     // await ugd_backend.bookmark_sc(postId);
//     // console.log("SourceCard bookmarked successfully");

//   } catch (error) {
//     console.error("Error performing actions with hardcoded inputs: ", error);
//   }
// };

// // Calls every time for demo.
// // testSourceCards();