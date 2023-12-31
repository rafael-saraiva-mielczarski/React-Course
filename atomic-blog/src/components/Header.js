import SearchPosts from "./SearchPosts";
import Results from "./Results";
import { usePosts } from "../contexts/PostContext";

export default function Header() {
  // 3 - consumindo os dados do context
  const { onClearPosts } = usePosts();

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}
