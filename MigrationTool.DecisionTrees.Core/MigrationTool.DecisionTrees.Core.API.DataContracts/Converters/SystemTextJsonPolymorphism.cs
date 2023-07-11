using System.Text.Json.Serialization;
using System.Text.Json;
using System;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts.Converters
{
    public class SaveItemConverter : JsonConverter<DC.SaveItem>
    {
        public override bool CanConvert(Type typeToConvert) => typeof(DC.SaveItem).IsAssignableFrom(typeToConvert);

        public override SaveItem Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.StartObject)
            {
                throw new JsonException();
            }
            using (var jsonDocument = JsonDocument.ParseValue(ref reader))
            {
                if (!jsonDocument.RootElement.TryGetProperty("$type", out var typeProperty))
                {
                    throw new JsonException();
                }
                var jsonPet = jsonDocument.RootElement.GetRawText();

                switch (typeProperty.GetString())
                {
                    case "question":
                        return (DC.SaveQuestion)JsonSerializer.Deserialize(jsonPet, typeof(DC.SaveQuestion));
                    case "answer":
                        return (DC.SaveAnswer)JsonSerializer.Deserialize(jsonPet, typeof(DC.SaveAnswer));
                    default:
                        throw new JsonException();
                };
            }
        }
       
        public override void Write(
        Utf8JsonWriter writer, DC.SaveItem item, JsonSerializerOptions options)
        {
            if (item is DC.SaveAnswer answer)
            {
                JsonSerializer.Serialize(writer, answer);
            }
            //else if (item is S.Answer answer)
            //{
            //    JsonSerializer.Serialize(writer, answer);
            //}
        }
    }
}



