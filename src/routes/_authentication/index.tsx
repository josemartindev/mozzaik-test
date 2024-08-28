import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createFileRoute } from "@tanstack/react-router";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import {
  Avatar,
  Box,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  StackDivider,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";
import { format } from "timeago.js";

import { Loader } from "../../components/loader";
import { MemePicture } from "../../components/meme-picture";
import { AppState } from "../../main";
import { fetchMemes, createComment } from "../../redux/features/memesSlice";
import { AppDispatch, RootState } from '../../main';
import { getUserByIdentification } from "../../redux/features/userSlice";
import { signout } from "../../redux/features/authenticationSlice";

export const MemeFeedPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { username, pictureUrl: userPictureUrl } = useSelector((state: AppState) => state.user);
  const isFetching = useSelector((state: RootState) => state.memes.isFetching);
  const memes = useSelector((state: AppState) => state.memes.memes);
  const token = useSelector((state: AppState) => state.auth.token);
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(signout());
      window.location.reload();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isFetching) {
      dispatch(fetchMemes({ token, page: 1 }));
      dispatch(getUserByIdentification({ token }));
    }
  }, []);
 
  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);

  const [commentContent, setCommentContent] = useState<{
    [key: string]: string;
  }>({});

  if (isFetching) {
    return <Loader data-testid="meme-feed-loader" />;
  }

  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        {memes?.map((meme) => {
          return (
            <VStack key={meme.id} p={4} width="full" align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex>
                  <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    size="xs"
                    name={meme.author.username}
                    src={meme.author.pictureUrl}
                  />
                  <Text ml={2} data-testid={`meme-author-${meme.id}`}>{meme.author.username}</Text>
                </Flex>
                <Text fontStyle="italic" color="gray.500" fontSize="small">
                  {format(meme.createdAt)}
                </Text>
              </Flex>
              <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />
              <Box>
                <Text fontWeight="bold" fontSize="medium" mb={2}>
                  Description:{" "}
                </Text>
                <Box
                  p={2}
                  borderRadius={8}
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${meme.id}`}>
                    {meme.description}
                  </Text>
                </Box>
              </Box>
              <LinkBox as={Box} py={2} borderBottom="1px solid black">
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center">
                    <LinkOverlay
                      data-testid={`meme-comments-section-${meme.id}`}
                      cursor="pointer"
                      onClick={() =>
                        setOpenedCommentSection(
                          openedCommentSection === meme.id ? null : meme.id,
                        )
                      }
                    >
                      <Text data-testid={`meme-comments-count-${meme.id}`}>{meme.commentsCount} comments</Text>
                    </LinkOverlay>
                    <Icon
                      as={
                        openedCommentSection !== meme.id ? CaretDown : CaretUp
                      }
                      ml={2}
                      mt={1}
                    />
                  </Flex>
                  <Icon as={Chat} />
                </Flex>
              </LinkBox>
              <Collapse in={openedCommentSection === meme.id} animateOpacity>
                <Box mb={6}>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      dispatch(createComment({ token, memeId: meme.id, content: commentContent[meme.id] }));
                    }}
                  >
                    <Flex alignItems="center">
                      <Avatar
                        borderWidth="1px"
                        borderColor="gray.300"
                        name={username}
                        src={userPictureUrl}
                        size="sm"
                        mr={2}
                      />
                      <Input
                        placeholder="Type your comment here..."
                        onChange={(event) => {
                          setCommentContent({
                            ...commentContent,
                            [meme.id]: event.target.value,
                          });
                        }}
                        value={commentContent[meme.id]}
                      />
                    </Flex>
                  </form>
                </Box>
                <VStack align="stretch" spacing={4}>
                  {meme.comments.map((comment) => (
                    <Flex key={comment.id}>
                      <Avatar
                        borderWidth="1px"
                        borderColor="gray.300"
                        size="sm"
                        name={comment.author.username}
                        src={comment.author.pictureUrl}
                        mr={2}
                      />
                      <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Flex>
                            <Text data-testid={`meme-comment-author-${meme.id}-${comment.id}`}>{comment.author.username}</Text>
                          </Flex>
                          <Text
                            fontStyle="italic"
                            color="gray.500"
                            fontSize="small"
                          >
                            {format(comment.createdAt)}
                          </Text>
                        </Flex>
                        <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${meme.id}-${comment.id}`}>
                          {comment.content}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              </Collapse>
            </VStack>
          );
        })}
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
