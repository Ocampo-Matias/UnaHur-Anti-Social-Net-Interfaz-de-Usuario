type TagPillProps = {
  tag: string;
};

export default function TagPill({ tag }: TagPillProps) {
  return <span className="tag-pill">{tag}</span>;
}
