const similarItems = (currentItem: any, allItems: any[]) => {
  let tags: string[] = [];

  if (currentItem.data.tags.length > 0) {
    tags = currentItem.data.tags;
  }

  const filterByTags = allItems.filter((item: any) =>
    tags.find((tag) => item.data.tags.includes(tag)),
  );

  const mergedItems = [...new Set([...filterByTags])];

  const filterBySlug = mergedItems.filter(
    (product) => product.id !== currentItem.id,
  );

  return filterBySlug;
};

export default similarItems;
